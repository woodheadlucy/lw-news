exports.up = function (connection, Promise) {
  return connection.schema.createTable('articles', (articlesTable) => {
    console.log('creating articles table');
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articlesTable
      .string('username')
      .references('users.username')
      .notNullable();
    articlesTable.timestamps('created_at');
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping articles table');
  return connection.schema.dropTable('articles');
};
