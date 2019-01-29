
// TOPIC CONTROLLER!!

const { fetchTopics, insertNewTopic, fetchTopicsByArticle } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    if (!topics) return Promise.reject({ status: 404, message: 'topic not found' });
    res.status(200).send(({ topics }));
  }).catch(next);
};


exports.addTopic = (req, res, next) => {
  const newTopic = req.body;

  insertNewTopic(newTopic).then(([topic]) => {
    res.status(201).json({ topic });
  }).catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const chosenTopic = req.params.topic;

  fetchTopicsByArticle(chosenTopic).then((articles) => {
    // console.log(topics);
    res.status(200).send(({ articles }));
  }).catch(next);
};
