const { encrypt } = require("./encoder");
const { findAndUpdate, store, findOne } = require("./execute");

exports.generateToken = async (req,user)=> {
     const tokenData = {
          email: user[0].email,
          token: encrypt(`${user[0].password}+${new Date().getMilliseconds()}`)
     }
     req.user = tokenData;
     const checkForToken = await findOne('tokens')({email:user[0].email});
     if(checkForToken.length < 1){
          const savetoken = await store('tokens')(tokenData);
          return savetoken[0].token;
     }
    await findAndUpdate('tokens')({email: user[0].email}, {token: tokenData.token});
    const newToken =await findOne('tokens')({email:user[0].email});
     return newToken[0].token;
}