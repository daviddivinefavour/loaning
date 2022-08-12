const yup = require('yup');

const registerValidator = yup.object().shape({
     firstname: yup.string().required('Firstname is required'),
     lastname: yup.string().required('Lastname is required'),
     email: yup.string().required('E-mail is required'),
     password: yup.string().required('Password is required').min(6)
});

const loginValidator = yup.object().shape({
     email: yup.string().required('Username is required'),
     password: yup.string().required('Password is required').min(6)
});

module.exports = {
     registerValidator,
     loginValidator
}