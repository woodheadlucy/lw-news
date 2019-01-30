const {
  fetchArticles,
} = require('../db/models/articles');


exports.getArticles = (req, res, next) => {
  const chosenLimit = req.query.limit;
  fetchArticles(chosenLimit).then((articles) => {
    if (!articles) return Promise.reject({ status: 404, message: 'topic not found' });
    res.status(200).send(({ articles }));
  }).catch(next);
};
