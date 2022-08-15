/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     return knex.schema
     .createTable('transactions', function (table) {
         table.increments('id').primary().unsigned();
         table.string('email', 255).notNullable();
         table.string('amount', 255).notNullable();
         table.string('type', 255).notNullable();
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
