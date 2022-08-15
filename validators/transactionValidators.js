const yup = require('yup');

const createPinValidator = yup.object().shape({
     pin: yup.string().required('Pin is required')
});

const makeTransactionValidator = yup.object().shape({
     amount: yup.number().required('Amount is required'),
     pin: yup.number().required('Amount is required'),
});

module.exports = {
     createPinValidator,
     makeTransactionValidator
}