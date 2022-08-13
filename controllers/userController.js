const { store, findOne, findAndUpdate } = require('../utils/execute');
const { encrypt, decrypt } = require('../utils/encoder');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { generateToken } = require('../utils/token');
const checkEmptyQueryResponse = require('../utils/checkEmptyQueryResponse');
const comparePin = require('../utils/comparePin');

exports.register = async (req, res) => {
     const validator = await registerValidator.validate(req.body);
     validator.password = encrypt(validator.password);
     const user = await store('users')(validator);
     if(!user.code){
          const token = await generateToken(req,user)
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
     const checker = checkEmptyQueryResponse(user,500,'User not found');
     if(checker){
          return res.status(500).json({...checker})
     }
     const passwordIsCorrect = decrypt(validator.password, user[0].password);
     if( user && passwordIsCorrect){
          const token = await generateToken(req,user);
          return res.status(200).json({
               status: 200,
               message: 'User logged in successfully',
               token
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

