const router = require('express').Router();

const { handle405 } = require('../errors/index');

const {
  getUsers,
  insertNewUser,
  getUserbyUsername,
  getArticlesbyUsername,
} = require('../controllers/user-controller');

router
  .route('/')
  .get(getUsers)
  .post(insertNewUser)
  .all(handle405);

router
  .route('/:username')
  .get(getUserbyUsername)
  .all(handle405);

router
  .route('/:username/articles')
  .get(getArticlesbyUsername)
  .all(handle405);

module.exports = router;
