const yup = require('yup');

const loginChecker = async (req, res, next) => {
     try {
          const schema = yup.object().shape({
          email: yup.string().email().required(),
          password: yup.string().required().min(6),
          });

          await schema.validate(req.body, { abortEarly: false });
          return next();

     } catch (error) { 
          return res.status(400).json({
               status: 400,
               title: 'Bad Request',
               message: error.errors
          });;
     }
}

const createChecker = async (req, res, next) => {
     try {
          const schema = yup.object().shape({
               firstname: yup.string().required('Firstname is required'),
               lastname: yup.string().required('Lastname is required'),
               email: yup.string().required('Email is required'),
               password: yup.string().min(6).max(30).required('Password is required'),
               confirmPassword: yup.string().min(6).max(30).oneOf([yup.ref('password'), null], 'Password must match'),
          });

          await schema.validate(req.body, { abortEarly: false });
          return next();

     } catch (error) { 
          return res.status(400).json({
               status: 400,
               title: 'Bad Request',
               message: error.errors
          });;
     }
}

const createPinChecker = async (req, res, next) => {
     try {
          const schema = yup.object().shape({
               pin: yup.string().min(4).max(4).required('Pin is required'),
               confirmPin: yup.string().min(4).max(4).oneOf([yup.ref('pin'), null], 'Pin must match'),
          });

          await schema.validate(req.body, { abortEarly: false });
          return next();

     } catch (error) { 
          return res.status(400).json({
               status: 400,
               title: 'Bad Request',
               message: error.errors
          });;
     }
}
const makeTransactionChecker =  async (req, res, next) => {
     try {
          const schema = yup.object().shape({
          amount: yup.number().required('Amount is required'),
          pin: yup.string().min(4).max(4).required('Pin is required'),
     });
          await schema.validate(req.body, { abortEarly: false });
          return next();

     } catch (error) { 
          return res.status(400).json({
               status: 400,
               title: 'Bad Request',
               message: error.errors
          });;
     }
}
const makeTransferChecker =  async (req, res, next) => {
     try {
          const schema = yup.object().shape({
          amount: yup.number().required('Amount is required'),
          pin: yup.string().min(4).max(4).required('Pin is required'),
          recipientEmail: yup.string().required('Recipient email is required')
     });
          await schema.validate(req.body, { abortEarly: false });
          return next();

     } catch (error) { 
          return res.status(400).json({
               status: 400,
               title: 'Bad Request',
               message: error.errors
          });;
     }
}
module.exports = {
     loginChecker,
     createChecker,
     createPinChecker,
     makeTransactionChecker,
     makeTransferChecker
}