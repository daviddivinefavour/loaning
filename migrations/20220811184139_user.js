/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     return knex.schema
     .createTable('users', function (table) {
         table.increments('id').primary().unsigned();
         table.string('firstname', 255).notNullable();
         table.string('lastname', 255).notNullable();
         table.string('email', 255).unique().notNullable();
         table.string('password', 255).notNullable();
         table.double('wallet', 255).defaultTo(0);
         table.integer('pin')
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
