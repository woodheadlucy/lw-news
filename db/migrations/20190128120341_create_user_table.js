exports.up = function (connection, Promise) {
  return connection.schema.createTable('users', (userTable) => {
    console.log('creating users table');
    userTable
      .string('username')
      .primary()
      .notNullable();
    userTable.string('name').notNullable();
    userTable.string('url').notNullable();
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping users table');
  return connection.schema.dropTable('users');
};
