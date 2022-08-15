const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { authUser } = require('../middlewares/getAuthUser');

router.post('/test',authUser,transactionController.test)

module.exports = router;