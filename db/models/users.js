// USERS MODEL!!!


const connection = require('../connection');


exports.fetchUsers = () => connection.select('*').from('users').returning('*');
exports.addUser = newUser => connection.insert(newUser).into('users').returning('*');
exports.returnUserbyUsername = username => connection.select('*').from('users').where({ username });
exports.returnArticlesbyUsername = username => connection.select('articles.author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic').count('comments.article_id AS comment_count').from('articles').leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .where('articles.author', '=', username)
  .groupBy('articles.author', 'articles.title', 'articles.article_id');
