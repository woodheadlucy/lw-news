const router = require('express').Router();

const {
  getArticles, getArticleById, updateVote, deleteArticle, getComments,
} = require('../controllers/article-controller');

router.route('/').get(getArticles);

router.route('/:article_id').get(getArticleById).patch(updateVote).delete(deleteArticle);

router.route('/:article_id/comments').get(getComments);

module.exports = router;
