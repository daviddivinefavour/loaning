const { registerService, loginService } = require('../services/authService');
const { respond } = require('../utils/respond');
const { setTransactionPinService } = require('../services/transactionService');

exports.register = async (req, res) => {
     const serviceReply = await registerService(req,req.body);
     const {response,data}=serviceReply;
     req.user = data;
     return respond(response.status)(response.message)(res)(data); 
}

exports.login = async (req, res)=>{
     const serviceReply = await loginService(req,req.body);
     const {response,data}=serviceReply;
     req.user = data;
     return respond(response.status)(response.message)(res)(data); 
}

exports.setPin = async (req, res)=>{
     const serviceReply = await setTransactionPinService(req,req.body,'create');
     const {response}=serviceReply;
     return respond(response.status)(response.message)(res)(); 
}