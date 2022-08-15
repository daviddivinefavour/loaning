const { makeTransactionService } = require("../services/transactionService");
const { respond } = require("../utils/respond");

exports.fundingAccount = async (req, res)=>{
  const serviceReply = await makeTransactionService(req,req.body,'credit')
  const {response,data}=serviceReply;
  return respond(response.status)(response.message)(res)(data); 
}

exports.transferFunds = async (req,res)=>{
  const {amount,recipientEmail,pin}=req.body;
  const {email} = req.user;
  const user = await findOne('users')({email});
  const checker = checkEmptyQueryResponse(user,500,'User not found');
  if(checker){
       return res.status(500).json({...checker})
  }
  if(!user[0].pin){
       return res.status(400).json({
            status: 400,
            message: 'Pin not set'
       });
  }
  const correctPin = comparePin(pin,user[0].pin)
  if(!correctPin){
       return res.status(405).json({
            status: 405,
            message: "Pin is incorrect"
       });
  }

  const reciever = await findOne('users')({email:recipientEmail});
  const checkReciever = checkEmptyQueryResponse(reciever,500,'Reciever does not exist');
  if(checkReciever){
       return res.status(500).json({...checkReciever})
  }
  const lowBalance = insufficientBalance(user,amount)
  if(lowBalance){
       return res.status(405).json({
            status: 405,
            message: "Insufficient balance"
       })
  }
  const afterDebit =  user[0].wallet - amount;
  await findAndUpdate('users')({email:recipientEmail},{wallet: (reciever[0].wallet + amount)});
  await findAndUpdate('users')({email},{wallet: afterDebit});
  const newBalance = await findOne('users')({email});

  return res.status(200).json({
       status:200,
       message: `Transfer of ${amount} is completed.`,
       balance: newBalance[0].wallet
  })
}

exports.withdrawFunds = async (req,res)=>{
  const serviceReply = await makeTransactionService(req,req.body,'debit')
  const {response,data}=serviceReply;
  return respond(response.status)(response.message)(res)(data); 
}


