const router = require('express').Router();
const {
  getTopics, addTopic, getArticlesByTopic, addArticle,
} = require('../controllers/topic-controller');

router.route('/').get(getTopics).post(addTopic);

router.route('/:topic/articles').get(getArticlesByTopic).post(addArticle);


module.exports = router;
