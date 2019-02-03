// USERS MODEL!!!


const connection = require('../connection');

exports.countArticlesbyUser = ({ username }) => connection.select('username').count({ total_count: 'username' }).from('articles').leftJoin('users', 'users.username', '=', 'articles.author')
  .groupBy('username')
  .where('articles.author', '=', username);

exports.fetchUsers = () => connection.select('*').from('users').returning('*');
exports.addUser = newUser => connection.insert(newUser).into('users').returning('*');
exports.returnUserbyUsername = username => connection.select('*').from('users').where({ username });
exports.returnArticlesbyUsername = (username, limit = 10, sort_by = 'created_at', p = 1, order = 'DESC') => connection.select('articles.author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic').count('comments.article_id AS comment_count').from('articles').leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .where('articles.author', '=', username)
  .groupBy('articles.author', 'articles.title', 'articles.article_id')
  .offset((p - 1) * limit)
  .orderBy(sort_by, order)
  .limit(limit);
