const { store, findAndUpdate, findOne } = require("../utils/execute");
const returner = require("../utils/returner");
const { createPinValidator } = require("../validators/transactionValidators");

const checkPin = (data, pin) => data.pin === pin;

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

const makeTransactionService = async (type,amount,pin,user)=>{
  if (type !== "credit" && type !== "debit") {
    return returner('error')(422)('Transaction Type not set')('Unprocessable Entity')()
  }
  const isCorrectPin = checkPin(user, pin);
  if (!isCorrectPin) {
    return returner('error')(405)('Incorrect pin')('Method not allowed')();
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

const makeTransfer = (data) => {};

module.exports = {
  makeTransactionService,
  makeTransfer,
  setTransactionPinService
};
