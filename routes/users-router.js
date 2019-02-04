const router = require('express').Router();

const {
  getUsers,
  insertNewUser,
  getUserbyUsername,
  getArticlesbyUsername,
} = require('../controllers/user-controller');

router
  .route('/')
  .get(getUsers)
  .post(insertNewUser);

router.route('/:username').get(getUserbyUsername);

router.route('/:username/articles').get(getArticlesbyUsername);

module.exports = router;
