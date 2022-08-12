const knexConfig = require('../knexfile');
const knex  = require('knex')(knexConfig[process.env.NODE_ENV]);


const store = (model) => (data) => {
  return knex(model)
  .insert(data)
  .then( (id) => knex(model)
        .where({id})
        .then((transaction) => transaction))
  .catch((err)=>err);
}

   
const findOne = (model) => (field) => { 
  return knex(model)
    .where(field)
    .then((data) =>  data)
    .catch((err) => err);
}

const update = (modal) => (field, data) => knex(modal).where(field).update(data).then((data)=>{return data}).catch((err)=>{console.log(err)});

module.exports = {
  store,
  findOne,
  update
}