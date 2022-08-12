const { encrypt } = require("./encoder");

exports.generateToken = ()=> encrypt(`${Math.random()}`);