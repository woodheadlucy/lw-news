const {
  fetchArticles, fetchArticleById, insertNewArticle, modifyVote, removeArticle, fetchComments,
} = require('../db/models/articles');


const { insertNewComment, modifyCommentVote, removeComment } = require('../db/models/comments');

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

  removeArticle(chosenArticleDelete).then(() => {
    res.status(204).send();
  }).catch(next);
};


exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit, sort_by, p, order,
  } = req.query;


  fetchComments(article_id, limit, sort_by, p, order).then((comments) => {
    res.status(200).send({ comments });
  }).catch(next);
};


exports.addComment = (req, res, next) => {
  const newComment = req.body;

  insertNewComment(newComment).then(([comment]) => {
    res.status(201).json({ comment });
  }).catch(next);
};


exports.updateCommentVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id, comment_id } = req.params;
  console.log(req.params, '<<<<column');


  modifyCommentVote(inc_votes, article_id, comment_id).then(([comment]) => {
    res.status(200).send(({ comment }));
  }).catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id, comment_id } = req.params;

  removeComment(inc_votes, article_id, comment_id), then(() => {
    res.status(204).send();
  }).catch(next);
};
