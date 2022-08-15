const { makeTransaction } = require("../services/transactionService");

exports.test = async (req, res) => {
  const report = await makeTransaction(req.body);
  console.log(report);
};
