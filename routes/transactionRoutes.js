const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { authUser } = require('../middlewares/getAuthUser');
const {makeTransactionChecker,makeTransferChecker } = require('../middlewares/check');

router.patch('/home/account/funding' ,makeTransactionChecker,authUser, transactionController.fundingAccount);
router.patch('/home/account/transfer',authUser, transactionController.transferFunds);
router.patch('/home/account/withdraw',makeTransactionChecker,authUser, transactionController.withdrawFunds);

module.exports = router;