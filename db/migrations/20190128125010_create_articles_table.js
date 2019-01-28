exports.up = function (connection, Promise) {
  console.log('creating articles table');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .onDelete('CASCADE');
    articlesTable
      .string('username')
      .references('users.username')
      .onDelete('CASCADE');
    articlesTable.timestamp('created_at').defaultTo(connection.fn.now());
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping articles table');
  return connection.schema.dropTable('articles');
};
