exports.up = function (connection, Promise) {
  console.log('creating comments table');
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('username')
      .references('users.username')
      .notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentsTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    commentsTable.timestamp('created_at').defaultTo(connection.fn.now());
    commentsTable.text('body');
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping comments table');
  return connection.schema.dropTable('comments');
};
