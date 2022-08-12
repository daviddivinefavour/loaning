const router = require('express').Router();
const userController = require('../controllers/userController');

// create a new user
// fund account
// transfer funds to another user
// withdraw funds from account

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;