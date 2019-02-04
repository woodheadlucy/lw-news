const router = require('express').Router();

const { handle405 } = require('../errors/index');

const {
  getTopics,
  addTopic,
  getArticlesByTopic,
} = require('../controllers/topic-controller');

const { addArticle } = require('../controllers/article-controller');

router
  .route('/')
  .get(getTopics)
  .post(addTopic)
  .all(handle405);

router
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticle)
  .all(handle405);

module.exports = router;
