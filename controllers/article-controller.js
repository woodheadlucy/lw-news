const {
  fetchArticles,
  fetchArticleById,

  modifyVote,
  removeArticle,
  fetchComments,
  countArticles,
} = require('../db/models/articles');

const {
  insertNewComment,
  modifyCommentVote,
  removeComment,
} = require('../db/models/comments');

exports.getArticles = (req, res, next) => {
  const { limit, p, order } = req.query;
  let { sort_by } = req.query;
  const validSorts = [
    'title',
    'created_at',
    'votes',
    'body',
    'article_id',
    'author',
  ];

  if (!validSorts.includes(sort_by)) sort_by = 'created_at';
  Promise.all([countArticles(), fetchArticles(limit, sort_by, p, order)])
    .then(([total_count, articles]) => {
      if (total_count === 0) {
        return Promise.reject({ status: 404, message: 'article not found' });
      }
      return res.status(200).send({ total_count, articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const chosenArtID = req.params.article_id;

  fetchArticleById(chosenArtID)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, message: 'article not found' });
      }
      return res.status(200).send({ article });
    })
    .catch(next);
};


exports.updateVote = (req, res, next) => {
  let { inc_votes } = req.body;
  const { article_id } = req.params;

  if (inc_votes === undefined) inc_votes = 0;
  modifyVote(article_id, inc_votes)
    .then(([article]) => {
      if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, message: 'invalid input' });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const chosenArticleDelete = req.params.article_id;

  removeArticle(chosenArticleDelete)
    .then((response) => {
      if (!response) {
        return Promise.reject({ status: 404, message: 'article not found' });
      }
      return res.status(204).send({ message: 'article deleted' });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit, p, order,
  } = req.query;

  let { sort_by } = req.query;
  const validCommentSorts = ['body', 'comment_id', 'username', 'article_id', 'votes', 'created_at'];

  if (!validCommentSorts.includes(sort_by)) sort_by = 'created_at';

  fetchComments(article_id, limit, sort_by, order, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      if (err.code === '22003') {
        next({ status: 404, message: 'invalid article id' });
      } else next(err);
    });
};

exports.addComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  insertNewComment(username, body, article_id)
    .then(([comment]) => {
      if (comment.article_id === null) { next({ status: 404, message: 'article does not exist' }); } else res.status(201).json({ comment });
    })
    .catch(next);
};

exports.updateCommentVote = (req, res, next) => {
  let { inc_votes } = req.body;
  const { article_id, comment_id } = req.params;

  if (inc_votes === undefined) inc_votes = 0;

  modifyCommentVote(inc_votes, article_id, comment_id)
    .then(([comment]) => {
      if (typeof inc_votes !== 'number') { next({ status: 400, message: 'invalid input' }); } else if (comment === undefined) { next({ status: 404, message: 'no article id' }); } else res.status(200).send({ comment });
    })
    .catch(next);
};


exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  removeComment(article_id, comment_id)
    .then((response) => {
      if (response === 0) next({ status: 404, message: 'sorry not found' });
      else res.status(204).send();
    })
    .catch(next);
};
