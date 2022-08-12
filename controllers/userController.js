const { store, findOne } = require('../utils/execute');
const { encrypt, decrypt } = require('../utils/encoder');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { setAuthUser } = require('../utils/token');

exports.register = async (req, res) => {
     const validator = await registerValidator.validate(req.body);
     validator.password = encrypt(validator.password);
     const user = await store('users')(validator);
     if(!user.code){
          setAuthUser(req, user[0]);
          return res.status(201).json({
               status: 201,
               message: 'User registered successfully',
               user: user
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
          setAuthUser(req, user[0]);
          return res.status(200).json({
               status: 200,
               message: 'User logged in successfully',
               token: req.headers.token,
               data: user
          })
     }
     return res.status(403).json({
          status: 403,
          message: 'User not found'
     })
}

exports.update = async (req, res)=>{
     
}