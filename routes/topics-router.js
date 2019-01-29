const router = require('express').Router();
const { getTopics, addTopic, getArticlesByTopic } = require('../controllers/topic-controller');

router.route('/').get(getTopics).post(addTopic);

router.route('/:topic/articles').get(getArticlesByTopic);


module.exports = router;
