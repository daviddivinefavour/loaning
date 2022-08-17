const { store, findOne, findAndUpdate,isDuplicate } = require('../utils/execute');
const { encrypt, decrypt } = require('../utils/encoder');
const returner = require('../utils/returner');

const generateToken = async (user)=> {
     const tokenData = {
          email: user.email,
          token: encrypt(`${user.password}+${new Date().getMilliseconds()}`)
     }
     const checkForToken = await findOne('tokens')({email:user.email});
     if(!checkForToken){
          const savetoken = await store('tokens')(tokenData);
          return savetoken.token;
     }
    await findAndUpdate('tokens')({email: user.email}, {token: tokenData.token});
    const newToken =await findOne('tokens')({email:user.email});
     return newToken.token;
}

const registerService = async (data) => {
     const {email} = data;
     data.password = encrypt(data.password);
     const isEmailTaken = await isDuplicate('users')({email}) ;
     if(isEmailTaken){
          return returner('error')(422)('Email already taken')('Unprocessable Entity')()
     }
     const user = await store('users')(data);
     if(!user){
          return returner('error')(501)('Oops an error occurred')('Internal Server Entry')()
     }
     const token = await generateToken(user);
     const details = {...user}
     delete details.password;
     details.token=token;
     return returner('success')(201)('New user created')('Created')(details);
}

const loginService = async (data) => {
     const {email} = data;
     const user = await findOne('users')({email});
     if(!user){
          return returner('error')(400)('Invalid Login Details')('Bad Request')()
     }
     const passwordIsCorrect = decrypt(data.password, user.password);
     if( user && passwordIsCorrect){
          const details = {...user}
          details.token = await generateToken(user);
          delete details.password;
          return returner('success')(200)('User logged in successfully')('OK')(details)
     }
     return returner('error')(422)('User not found')('Unprocessable entity')()
}

module.exports = {
     registerService,
     loginService,
     generateToken
}