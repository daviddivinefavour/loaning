const { store, findOne, findAndUpdate } = require('../utils/execute');
const { encrypt, decrypt } = require('../utils/encoder');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { generateToken } = require('../utils/token');

exports.register = async (req, res) => {
     const validator = await registerValidator.validate(req.body);
     validator.password = encrypt(validator.password);
     const user = await store('users')(validator);
     if(!user.code){
          const tokenData ={
               token: generateToken(),
               email: user[0].email
          }
          const token = await store('tokens')(tokenData);
          return res.status(201).json({
               status: 201,
               message: 'User registered successfully',
               user: user,
               token
          });
     }
     return res.status(500).json({
          status: 500,
          message: 'User not registered'
     });
}

exports.login = async (req, res)=>{
     const validator = await loginValidator.validate(req.body);
     const {email} = validator
     const user = await findOne('users')({email});
     if(user.length < 1 ){
          return res.status(404).json({
               status: 404,
               message: 'User not found'
          });
     }
     const passwordIsCorrect = decrypt(validator.password, user[0].password);
     if( user && passwordIsCorrect){
          const token = await findAndUpdate('tokens')({email}, {token: generateToken()});
          return res.status(200).json({
               status: 200,
               message: 'User logged in successfully',
               token: token[0].token
          })
     }
     return res.status(403).json({
          status: 403,
          message: 'User not found'
     })
}

exports.setPin = async (req, res)=>{
     const {pin} = req.body;
     const {email} = req.user;
     const user = await findAndUpdate('users')({email}, {pin});
     if(user.length < 1 ){
          return res.status(500).json({
               status: 500,
               message: 'unexpected error'
          });
     }
     return res.status(200).json({
          status: 200,
          message: 'Pin set successfully',
     })
}