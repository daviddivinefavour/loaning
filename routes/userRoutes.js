const router = require('express').Router();
const userController = require('../controllers/userController');
const { authUser } = require('../middlewares/getAuthUser');

// create a new user
// fund account
// transfer funds to another user
// withdraw funds from account

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/home/pin/set',authUser, userController.setPin);
router.patch('/home/account/funding',authUser, userController.fundingAccount);
router.patch('/home/account/transfer',authUser, userController.transferFunds);


module.exports = router;