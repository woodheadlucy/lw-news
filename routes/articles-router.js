const router = require('express').Router();

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

router.route('/').get(getArticles);

router
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateVote)
  .delete(deleteArticle);

router
  .route('/:article_id/comments')
  .get(getComments)
  .post(addComment);

router
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment);

module.exports = router;
