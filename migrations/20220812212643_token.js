/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     return knex.schema
     .createTable('tokens', function (table) {
         table.increments('id').primary().unsigned();
         table.string('email', 255).unique().notNullable();
         table.string('token', 255).notNullable();
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
