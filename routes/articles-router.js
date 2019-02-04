const router = require('express').Router();

const { handle405 } = require('../errors/index');
const {
  getArticles,
  getArticleById,
  updateVote,
  deleteArticle,
  getComments,
  addComment,
  updateCommentVote,
  deleteComment,
} = require('../controllers/article-controller');

router
  .route('/')
  .get(getArticles)
  .all(handle405);

router
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateVote)
  .delete(deleteArticle)
  .all(handle405);

router
  .route('/:article_id/comments')
  .get(getComments)
  .post(addComment)
  .all(handle405);

router
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment)
  .all(handle405);

module.exports = router;
