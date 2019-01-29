

const apiRouter = require('express').Router();

const { getTopics, addTopic, getArticlesByTopic } = require('../controllers/topic-controller');

apiRouter.get('/topics', getTopics);

apiRouter.post('/topics', addTopic);

apiRouter.get('/topics/:topic/articles', getArticlesByTopic);

module.exports = apiRouter;
