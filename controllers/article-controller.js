const {
  fetchArticles,
  fetchArticleById,
  insertNewArticle,
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
      if (total_count.length === 0) {
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

exports.addArticle = (req, res, next) => {
  const { title, author, body } = req.body;
  const { topic } = req.params;

  insertNewArticle(title, author, body, topic)
    .then(([article]) => res.status(201).json({ article }))
    .catch((err) => {
      if (err.code === '23503') {
        next({ status: 404, message: 'topic does not exist' });
      } else next(err);
    });
};

exports.updateVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  modifyVote(article_id, inc_votes)
    .then(([article]) => {
      if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, message: 'invalid input' });
      }
      return res.status(200).send({ article });
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
    limit, sort_by, p, order,
  } = req.query;

  fetchComments(article_id, limit, sort_by, p, order)
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
  const newComment = { username, body, article_id };
  insertNewComment(newComment)
    .then(([comment]) => {
      res.status(201).json({ comment });
    })
    .catch(next);
};

exports.updateCommentVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id, comment_id } = req.params;

  modifyCommentVote(inc_votes, article_id, comment_id)
    .then(([comment]) => {
      if (typeof inc_votes !== 'number' || !comment) {
        return Promise.reject({ status: 400, message: 'invalid input' });
      }
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;

  console.log(article_id, comment_id, '><<control');

  removeComment(article_id, comment_id)
    .then((response) => {
      if (!response) {
        return Promise.reject({
          status: 404,
          message: 'article does not exist',
        });
      }
      return res.status(204).send();
    })
    .catch(next);
};
