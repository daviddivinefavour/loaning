const { findOne } = require("../utils/execute");

exports.authUser = async (req,res,next)=>{
     const bearerToken = req.headers.authorization;
     if(!bearerToken){
          return res.status(401).json({
               status: 401,
               message: 'Token is required for authentication'
          });
     }
     const token = bearerToken.split(' ')[1]
     const isAuthenticated = await findOne('tokens')({token});
     if(isAuthenticated){
          req.user=isAuthenticated[0];
          return next();
     }
     return res.status(400).json({
          status: 400,
          message: 'Invalid token'
     });
}