const { store, findAndUpdate, findOne } = require("../utils/execute");

const getBalance = (data) => data[0].wallet;

const checkPin = (data, pin) => data[0].pin === pin;

const makeTransaction = async (data) => {
  const { type, amount, email, pin } = data;
  if (type !== "credit" && type !== "debit") {
    return {
      control: "error",
      response: {
        status: 422,
        message: "Opps something went wrong",
        title: "Unproccessed data entity",
      },
    };
  }
  const user = await findOne("users")({ email });
  if (user.length < 1) {
    return {
      control: "error",
      response: {
        status: 400,
        message: "User not found",
        title: "Bad request",
      },
    };
  }
  const isCorrectPin = checkPin(user, pin);
  if (!isCorrectPin) {
    return {
      control: "error",
      response: {
        status: 405,
        Title: "Method Not Allowed",
        message: "Incorrect Pin",
      },
    };
  }
  const details = {
    type: type,
    amount: amount,
    email: email,
  };

  const balance =
    type == "credit"
      ? user[0].wallet + amount
      : type === "debit" && getBalance(user) < amount
      ? user[0].wallet - amount
      : user[0].wallet;

  const newTransaction = await store("transactions")(details);
  if (newTransaction.length < 1) {
    return {
      control: "error",
      response: {
        status: 400,
        title: "Bad request",
        message: "Failed to log transaction",
      },
    };
  }
  if (type === "debit") {
    const debitUser = await findAndUpdate("users")({ email },{wallet: balance})
    console.log(debitUser);
    if (!debitUser) {
      return {
        control: "error",
        response: {
          status: 500,
          Title: "Internal server error",
          message: "Failed to debit account",
        },
      };
    }
    return {
      control: "success",
      type: "debit",
      response: {
        status: 200,
        message: `Debit  successful`,
        amount,
        wallet: balance,
      },
    };
  }

  if (type === "credit") {
    const creditUser = await findAndUpdate("users")({ email },{wallet: balance});
    if (!creditUser) {
      return {
        control: "error",
        response: {
          status: 500,
          Title: "Internal server error",
          message: "Failed to credit account",
        },
      };
    }
    return {
      control: "success",
      type: "credit",
      response: {
        status: 200,
        message: `Credit  successful`,
        amount,
        wallet: balance,
      },
    };
  }
};

const makeTransfer = (data) => {};

module.exports = {
  getBalance,
  makeTransaction,
  makeTransfer,
};
