const {
  fetchTopics,
  insertNewTopic,
  fetchArticlesByTopic,
  countArticlesByTopic,
  insertNewArticle,
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
  const { topic } = req.params;

  const { limit, p, order } = req.query;

  let { sort_by } = req.query;

  const validSorts = [
    'title',
    'article_id',
    'votes',
    'author',
    'created_at',
    'topic',
  ];

  if (!validSorts.includes(sort_by)) sort_by = 'created_at';

  Promise.all([
    countArticlesByTopic(req.params),
    fetchArticlesByTopic(topic, limit, sort_by, p, order),
  ])
    .then(([total_count, articles]) => {
      // if (total_count.length === 0 || !articles.length) {
      //   return Promise.reject({ status: 404, message: 'articles not found' });
      // }
      res.status(200).send({ total_count, articles });
    })
    .catch(err => console.log(err));
};

exports.addArticle = (req, res, next) => {
  const { title, author, body } = req.body;
  const { topic } = req.params;

  insertNewArticle(title, author, body, topic)
    .then(([article]) => {
      res.status(201).json({ article });
    })
    .catch(next);
};
