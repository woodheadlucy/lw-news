

const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const apiObj = require('../home');

apiRouter.route('/');
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/', (req, res, next) => {
  res.status(200).send(apiObj);
});


module.exports = apiRouter;
