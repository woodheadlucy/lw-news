// TOPIC CONTROLLER!!

const {
  fetchTopics,
  insertNewTopic,
  fetchArticlesByTopic,
} = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      if (!topics) {
        return Promise.reject({ status: 404, message: 'topic not found' });
      }
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  const newTopic = req.body;

  insertNewTopic(newTopic)
    .then(([topic]) => {
      res.status(201).json({ topic });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const chosenTopic = req.params.topic;
  const chosenLimit = req.query.limit;
  const chosenSort = req.query.sort_by;
  const chosenPage = req.query.p;
  const chosenOrder = req.query.order;

  fetchArticlesByTopic(
    chosenTopic,
    chosenLimit,
    chosenSort,
    chosenPage,
    chosenOrder,
  )
    .then(articles => (articles.length
      ? res.status(200).send({ articles })
      : Promise.reject({ status: 404, message: 'no articles found' })))
    .catch(next);
};
