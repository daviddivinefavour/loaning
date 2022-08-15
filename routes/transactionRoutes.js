const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { authUser } = require('../middlewares/getAuthUser');

router.patch('/home/account/funding',authUser, transactionController.fundingAccount);
router.patch('/home/account/transfer',authUser, transactionController.transferFunds);
router.patch('/home/account/withdraw',authUser, transactionController.withdrawFunds);

module.exports = router;