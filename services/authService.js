const { store, findOne, findAndUpdate,isDuplicate } = require('../utils/execute');
const { encrypt, decrypt } = require('../utils/encoder');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const returner = require('../utils/returner');

const generateToken = async (req,user)=> {
     const tokenData = {
          email: user[0].email,
          token: encrypt(`${user[0].password}+${new Date().getMilliseconds()}`)
     }
     const checkForToken = await findOne('tokens')({email:user[0].email});
     if(checkForToken.length < 1){
          const savetoken = await store('tokens')(tokenData);
          return savetoken[0].token;
     }
    await findAndUpdate('tokens')({email: user[0].email}, {token: tokenData.token});
    const newToken =await findOne('tokens')({email:user[0].email});
     return newToken[0].token;
}

const registerService = async (req,data) => {
     const validator = await registerValidator.validate(data);
     const {email} = validator;
     validator.password = encrypt(validator.password);
     const isEmailTaken = await isDuplicate('users')({email}) ;
     if(isEmailTaken){
          return returner('error')(422)('Email already taken')('Unprocessable Entity')()
     }
     const user = await store('users')(validator);
     if(user.length<1){
          return returner('error')(501)('Oops an error occurred')('Internal Server Entry')()
     }
     const token = await generateToken(req,user);
     const details = {...user[0]}
     delete details.password;
     details.token=token;
     return returner('success')(201)('New user created')('Created')(details);
}

const loginService = async (req,data) => {
     const validator = await loginValidator.validate(data);
     const {email} = validator;
     const user = await findOne('users')({email});
     if(user.length < 1){
          return returner('error')(400)('Invalid Login Details')('Bad Request')()
     }
     const passwordIsCorrect = decrypt(validator.password, user[0].password);
     if( user && passwordIsCorrect){
          const details = {...user[0]}
          details.token = await generateToken(req,user);
          delete details.password;
          return returner('success')(200)('User logged in successfully')('OK')(details)
     }
     return returner('error')(422)('User not found')('Unprocessable entity')()
}

module.exports = {
     registerService,
     loginService
}