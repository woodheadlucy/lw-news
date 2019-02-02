
// USERS CONTROLLER!!

const {
  fetchUsers, addUser, returnUserbyUsername, returnArticlesbyUsername,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    if (!users) return Promise.reject({ status: 404, message: 'topic not found' });
    res.status(200).send(({ users }));
  }).catch(next);
};

exports.insertNewUser = (req, res, next) => {
  const newUser = req.body;

  addUser(newUser).then(([user]) => {
    res.status(201).json({ user });
  }).catch(next);
};


exports.getUserbyUsername = (req, res, next) => {
  const { username } = req.params;

  returnUserbyUsername(username).then(([user]) => {
    res.status(200).json({ user });
  }).catch(next);
};


exports.getArticlesbyUsername = (req, res, next) => {
  const { username } = req.params;
  console.log(username, '<<<cont');
  returnArticlesbyUsername(username).then((articles) => {
    res.status(200).send({ articles });
  }).catch(next);
};
