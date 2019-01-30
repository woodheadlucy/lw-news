
// USERS CONTROLLER!!

const {
  fetchUsers, insertNewUser,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    if (!users) return Promise.reject({ status: 404, message: 'topic not found' });
    res.status(200).send(({ users }));
  }).catch(next);
};

exports.addUser = (req, res, next) => {
  const newUser = req.body;
  insertNewUser(newUser.then(([user]) => {
    res.status(201).json({ user });
  }).catch(next));
}
;