const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { authUser } = require('../middlewares/getAuthUser');
const {makeTransactionChecker,makeTransferChecker } = require('../middlewares/check');

router.post('/home/account/funding' ,makeTransactionChecker,authUser, transactionController.fundingAccount);
router.post('/home/account/transfer',makeTransferChecker,authUser, transactionController.transferFunds);
router.post('/home/account/withdraw',makeTransactionChecker,authUser, transactionController.withdrawFunds);

module.exports = router;