const yup = require('yup');

const createPinValidator = yup.object().shape({
     pin: yup.string().required('Pin is required')
});

const makeTransactionValidator = yup.object().shape({
     amount: yup.number().required('Amount is required'),
     pin: yup.number().required('pin is required'),
});

const makeTransferValidator = yup.object().shape({
     amount: yup.number().required('Amount is required'),
     pin: yup.number().required('Pin is required'),
     recipientEmail: yup.string().required('Recipient email is required')
});

module.exports = {
     createPinValidator,
     makeTransactionValidator,
     makeTransferValidator
}