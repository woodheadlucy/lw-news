exports.up = function(connection, Promise) {
  console.log('creating articles table');

  return conneciton.schema.createTable('articles', articlesTable => {
    articlesTable.increment('article_id').primary();
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
    articlesTables
      .string('username')
      .references('users.username')
      .notNullable();
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(connection, Promise) {};
