const {
  fetchArticles, fetchArticleById, insertNewArticle, modifyVote, removeArticle, fetchComments,
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


exports.updateVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  modifyVote(article_id, inc_votes).then(([article]) => {
    res.status(200).send({ article });
  }).catch(next);
};


exports.deleteArticle = (req, res, next) => {
  const chosenArticleDelete = req.params;
  // console.log(chosenArticleDelete, '<<<<< deleeete');
  removeArticle(chosenArticleDelete).then(() => {
    res.status(204).send();
  }).catch(next);
};


exports.getComments = (req, res, next) => {
  const chosenArticle = req.params.article_id;
  const chosenLimit = req.query.limit;
  const chosenSort = req.query.sort_by;
  const chosenPage = req.query.p;
  const chosenOrder = req.query.order;
  console.log(chosenArticle, '<<<<<<<< control');
  fetchComments(chosenArticle, chosenLimit, chosenSort, chosenPage, chosenOrder).then((comments) => {
    res.status(200).send({ comments });
  }).catch(next);
};
