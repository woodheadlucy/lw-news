// USERS CONTROLLER!!

const {
  fetchUsers,
  addUser,
  returnUserbyUsername,
  returnArticlesbyUsername,
  countArticlesbyUser,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      if (!users) { return Promise.reject({ status: 404, message: 'topic not found' }); }
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.insertNewUser = (req, res, next) => {
  const newUser = req.body;

  addUser(newUser)
    .then(([user]) => {
      res.status(201).json({ user });
    })
    .catch(next);
};

exports.getUserbyUsername = (req, res, next) => {
  const { username } = req.params;

  returnUserbyUsername(username)
    .then(([user]) => {
      res.status(200).json({ user });
    })
    .catch(next);
};

exports.getArticlesbyUsername = (req, res, next) => {
  const { username } = req.params;
  const {
    limit, sort_by, p, order,
  } = req.query;

  returnArticlesbyUsername(username, limit, sort_by, p, order).then(articles => Promise.all([countArticlesbyUser(req.params), articles])).then(([total_count, articles]) => {
    if (total_count.length === 0) return Promise.reject({ status: 404, message: 'sorry not found' });
    return res.status(200).send({ total_count, articles });
  }).catch(next);
};
