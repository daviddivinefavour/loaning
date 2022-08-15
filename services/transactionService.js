const { store, findAndUpdate, findOne } = require("../utils/execute");
const returner = require("../utils/returner");
const { createPinValidator } = require("../validators/transactionValidators");

const checkPin = (data, pin) => {
  isCorrectPin = data.pin === pin;
  if (!isCorrectPin) {
    const invalidPin = returner('error')(405)('Incorrect pin')('Method not allowed')();
    return invalidPin
  }
  false
}

const setTransactionPinService = async (req,data,control)=>{
  const validator = await createPinValidator.validate(data)
  const {pin} = validator;
  const {email} = req.user;
  const user = await findOne('users')({email});
  if(user.length < 1){
    return returner('error')(401)('User Not Found')('Unauthorized')()
  }
  await findAndUpdate('users')({email}, {pin:pin});
  if(control==='update'){
    return returner('success')(200)('Pin Updated successfully')('OK')(user[0])
  }
  return returner('success')(200)('Pin set Successfully')('OK')(user[0])

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
  const transactionResponse = await findAndUpdate("users")({ email:user.email },{wallet: balance});
  if (transactionResponse.length < 1) {
    return returner('error')(500)(`Failed to ${type} user account`)('Internal server error')()
  }
  const completedTransaction = {...transactionResponse[0]}
  delete completedTransaction.pin
  delete completedTransaction.password
  await store("transactions")(details);
  return returner('success')(200)(`${type} of ${amount} successful`)('Ok')(completedTransaction)
};

const makeTransferService = async (amount,user,recipientEmail) => {
  const recipient = await findOne('users')({email:recipientEmail})
  if(recipient.length < 1){
    return returner('error')(422)('Recipient not found')('Unprocessed entity')()
  }
  const reciever = {...recipient[0]};
  const data = {
    status: 'complete',
    from: `${user.firstname} ${user.lastname}`,
    to: `${reciever.firstname} ${reciever.lastname}`,
    amount,
  }
  const debitUser = await makeTransactionService('debit',amount,user)
  if(debitUser.control === 'success'){
      const creditUser = await makeTransactionService('credit',amount,reciever)
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
