// USERS MODEL!!!


const connection = require('../connection');


exports.fetchUsers = () => connection.select('*').from('users').returning('*');
exports.addUser = newUser => connection.insert(newUser).into('users').returning('*');
exports.returnUserbyUsername = oneUsername => connection.select('*').from('users').where({ username: oneUsername });
exports.returnArticlesbyUsername = username => connection.select('*').from('articles').join('users', 'articles.author', '=', 'users.username').where('users.username', username);
