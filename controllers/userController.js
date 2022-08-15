const { store, findOne, findAndUpdate } = require('../utils/execute');
const checkEmptyQueryResponse = require('../utils/checkEmptyQueryResponse');
const comparePin = require('../utils/comparePin');
const insufficientBalance = require('../utils/insufficientBalance');
const { registerService, loginService } = require('../services/authService');
const { success, fail, respond } = require('../utils/respond');

exports.register = async (req, res) => {
     const serviceReply = await registerService(req,req.body);
     const {response,data}=serviceReply;
     return respond(response.status)(response.message)(res)(data); 
}

exports.login = async (req, res)=>{
     const serviceReply = await loginService(req,req.body);
     const {response,data}=serviceReply;
     return respond(response.status)(response.message)(res)(data); 
}

exports.setPin = async (req, res)=>{
     const {pin} = req.body;
     const {email} = req.user;
     const oldUser = await findOne('users')({email});
     const checker = checkEmptyQueryResponse(oldUser,500,'User not found');
     if(checker){
          return res.status(500).json({...checker})
     }
    await findAndUpdate('users')({email}, {pin:pin});
     return res.status(200).json({
          status: 200,
          message: 'Pin set successfully',
     })
}

exports.fundingAccount = async (req, res)=>{
     const {amount,pin} = req.body;
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
     const wallet = user[0].wallet + amount;
     await findAndUpdate('users')({email}, {wallet});
     const newBalance = await findOne('users')({email});

     return res.status(200).json({
          status: 200,
          message: 'Funding successful',
          wallet: newBalance[0].wallet
     })
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
     const {amount,pin} = req.body;
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
     const wallet = user[0].wallet - amount;
     await findAndUpdate('users')({email}, {wallet});
     const newBalance = await findOne('users')({email});

     return res.status(200).json({
          status: 200,
          message: `Withdrawal of ${amount} is successful`,
          wallet: newBalance[0].wallet
     })
}