// USERS MODEL!!!


const connection = require('../connection');


exports.fetchUsers = () => connection.select('*').from('users').returning('*');
exports.insertNewUser = newUser => connection.insert(newUser).into('users').returning('*');
