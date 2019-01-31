const {
  fetchArticles, fetchArticleById, insertNewArticle,
} = require('../db/models/articles');


exports.getArticles = (req, res, next) => {
  const chosenLimit = req.query.limit;
  fetchArticles(chosenLimit).then((articles) => {
    if (!articles) return Promise.reject({ status: 404, message: 'topic not found' });
    res.status(200).send(({ articles }));
  }).catch(next);
};

exports.getArticleById = (req, res, next) => {
  const chosenArtID = req.params.article_id;

  fetchArticleById(chosenArtID).then(([article]) => {
    res.status(200).send(({ article }));
  }).catch(err => next(err));
};


exports.addArticle = (req, res, next) => {
  const newArticle = req.body;

  insertNewArticle(newArticle)
    .then(([article]) => {
      res.status(201).json({ article });
    }).catch(err => next(err));
};
