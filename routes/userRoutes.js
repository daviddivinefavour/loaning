const router = require('express').Router();
const userController = require('../controllers/userController');
const { loginChecker,createChecker,createPinChecker} = require('../middlewares/check');
const { authUser } = require('../middlewares/getAuthUser');

router.post('/register',createChecker, userController.register);
router.post('/login',loginChecker, userController.login);
router.put('/home/pin/set',createPinChecker,authUser, userController.setPin);

module.exports = router;