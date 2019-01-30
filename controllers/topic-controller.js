
// TOPIC CONTROLLER!!

const {
  fetchTopics, insertNewTopic, fetchArticlesByTopic, insertNewArticle,
} = require('../db/models/topics');

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
  const chosenLimit = req.query.limit;
  const chosenSort = req.query.sort_by;
  const chosenPage = req.query.p;
  const chosenOrder = req.query.order;

  // console.log(req.query.p, '<<<pageeee');


  fetchArticlesByTopic(chosenTopic, chosenLimit, chosenSort, chosenPage, chosenOrder).then((articles) => {
    res.status(200).send(({ articles }));
  }).catch(next);
};


exports.addArticle = (req, res, next) => {
  const { topic } = req.params;
  const { title, body, username } = req.body;

  insertNewArticle(newArticle).then(([article]) => {
    res.status(201).json({ article });
  }).catch(next);
};
