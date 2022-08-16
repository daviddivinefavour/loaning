const { registerService, loginService } = require('../services/authService');
const { respond } = require('../utils/respond');
const { setTransactionPinService } = require('../services/transactionService');

exports.register = async (req,res) => {
     const body = {...(req.body)};
     delete body.confirmPassword;
     const serviceReply = await registerService(body);
     const {response,data}=serviceReply;
     req.user = data;
     return respond(response.status)(response.message)(res)(data); 
}

exports.login = async (req, res)=>{
     const serviceReply = await loginService(req.body);
     const {response,data}=serviceReply;
     req.user = data;
     return respond(response.status)(response.message)(res)(data); 
}

exports.setPin = async (req, res)=>{
     const {pin} = req.body;
     const serviceReply = await setTransactionPinService(req,pin,'create');
     const {response}=serviceReply;
     return respond(response.status)(response.message)(res)(); 
}