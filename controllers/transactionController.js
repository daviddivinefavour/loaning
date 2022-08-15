const { makeTransactionService, checkPin, makeTransferService } = require("../services/transactionService");
const { respond } = require("../utils/respond");
const { getAuthenticatedUser } = require("../middlewares/getAuthUser");

exports.fundingAccount = async (req, res)=>{
  const user = getAuthenticatedUser(req);
  const {amount,pin} = req.body;
  const invalidPin = checkPin(user,pin)
  if (invalidPin) {
    const {response,data}=invalidPin;
    return respond(response.status)(response.message)(res)(data); 
  }
  const serviceReply = await makeTransactionService('credit',amount,user)
  const {response,data}=serviceReply;
  return respond(response.status)(response.message)(res)(data); 
}

exports.transferFunds = async (req,res)=>{
  const user = getAuthenticatedUser(req);
  const {amount,recipientEmail,pin}=req.body;
  const invalidPin = checkPin(user,pin)
  if (invalidPin) {
    const {response,data}=invalidPin;
    return respond(response.status)(response.message)(res)(data); 
  }
  const serviceReply = await makeTransferService(amount,user,recipientEmail)
  const {response,data}=serviceReply;
  return respond(response.status)(response.message)(res)(data); 
}

exports.withdrawFunds = async (req,res)=>{
  const user = getAuthenticatedUser(req);
  const {amount,pin} = req.body;
  const invalidPin = checkPin(user,pin)
  if (invalidPin) {
    const {response,data}=invalidPin;
    return respond(response.status)(response.message)(res)(data); 
  }
  const serviceReply = await makeTransactionService('debit',amount,user)
  const {response,data}=serviceReply;
  return respond(response.status)(response.message)(res)(data); 
}


