exports.up = function(connection, Promise) {
  return connection.schema.createTable('topics', topicsTable => {
    console.log('creating topics table');
    topicsTable
      .increments('slug')
      .primary()
      .notNullable();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping topics tables');
  return connection.schema.dropTable('topics');
};
