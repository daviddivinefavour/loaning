const { encrypt, decrypt } = require('./encoder');

exports.setAuthUser = (req,user)=>{
     const {email} = user;
     const tokenize = {};
     tokenize.token = encrypt(email);
     tokenize.email = email;
     req.headers.tokenize = tokenize;
}
