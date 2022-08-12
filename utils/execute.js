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

const findAndUpdate = (model) => (field, data) => {
  return knex(model)
    .where(field)
    .update(data)
    .then( (id) => knex(model)
      .where({id})
      .then((transaction) => transaction)).catch((err)=>err)
    .catch((err) => err);
}

module.exports = {
  store,
  findOne,
  findAndUpdate
}