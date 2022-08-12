exports.authUser = (req,res,next)=>{
     const {token, email} = req.headers.tokenize;
     const isAuthenticated =  decrypt(email,token);
     if(isAuthenticated){
          next();
     }
     return res.status(403).json({
          status: 403,
          message: 'Unathorized user'
     });
}