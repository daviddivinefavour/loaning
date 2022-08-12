const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);
const encrypt = (arg)=>bcrypt.hashSync(arg, salt);
const decrypt = (arg1, arg2) => bcrypt.compareSync(arg1, arg2);

module.exports = {
     encrypt,
     decrypt
}