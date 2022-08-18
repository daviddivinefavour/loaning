const { store, findAndUpdate, findOne } = require("../utils/execute");
const returner = require("../utils/returner");

const checkPin = (data, pin) => {
  isCorrectPin = data.pin === pin;
  if (!isCorrectPin) {
    const invalidPin = returner('error')(405)('Incorrect pin')('Method not allowed')();
    return invalidPin
  }
  false
}

const setTransactionPinService = async (req,pin,control)=>{
  const {email} = req.user;
  const user = await findOne('users')({email});
  if(!user){
    return returner('error')(401)('User Not Found')('Unauthorized')()
  }
  await findAndUpdate('users')({email}, {pin});
  if(control==='update'){
    return returner('success')(200)('Pin Updated successfully')('OK')(user)
  }
  return returner('success')(200)('Pin set Successfully')('OK')(user)
}

const makeTransactionService = async (type,amount,user)=>{
  if (type !== "credit" && type !== "debit") {
    return returner('error')(422)('Transaction Type not set')('Unprocessable Entity')()
  }
  const details = {
    type: type,
    amount: amount,
    email: user.email,
  };

  const balance =
    type == "credit"
      ? user.wallet + amount
      : type === "debit" && user.wallet > amount
      ? user.wallet - amount
      : user.wallet;

  if(type==='debit' && user.wallet<amount){
    return returner('error')(400)('Insufficient balance')('Bad request')()
  }
  await findAndUpdate('users')({ email:user.email },{wallet: balance}); 
  const transactionResponse =await findOne('users')({email:user.email})
  if (!transactionResponse) {
    return returner('error')(500)(`Failed to ${type} user account`)('Internal server error')()
  }
  delete transactionResponse.pin
  delete transactionResponse.password
  await store("transactions")(details);
  return returner('success')(200)(`${type} of ${amount} successful`)('Ok')(transactionResponse)
};

const makeTransferService = async (amount,user,recipientEmail) => {
  const recipient = await findOne('users')({email:recipientEmail})
  if(!recipient){
    return returner('error')(422)('Recipient not found')('Unprocessed entity')()
  }
  const data = {
    status: 'complete',
    from: `${user.firstname} ${user.lastname}`,
    to: `${recipient.firstname} ${recipient.lastname}`,
    amount,
  }
  const debitUser = await makeTransactionService('debit',amount,user)
  if(debitUser.control === 'success'){
      const creditUser = await makeTransactionService('credit',amount,recipient)
      if(creditUser.control === 'success'){
        return returner('success')(200)(`Transfer successful`)('OK')(data)
      }
      return creditUser;
  }
  return debitUser;
};

module.exports = {
  makeTransactionService,
  makeTransferService,
  setTransactionPinService,
  checkPin
};
