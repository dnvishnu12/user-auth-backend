exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('full_name');
    table.string('city');
    table.string('country');
    table.string('email');
    table.string('mobile_number');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('full_name');
    table.dropColumn('city');
    table.dropColumn('country');
    table.dropColumn('email');
    table.dropColumn('mobile_number');
  });
};
