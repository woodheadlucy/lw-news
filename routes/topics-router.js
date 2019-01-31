const router = require('express').Router();
const {
  getTopics, addTopic, getArticlesByTopic,
} = require('../controllers/topic-controller');

const { addArticle } = require('../controllers/article-controller');

router.route('/').get(getTopics).post(addTopic);

router.route('/:topic/articles').get(getArticlesByTopic).post(addArticle);


module.exports = router;
