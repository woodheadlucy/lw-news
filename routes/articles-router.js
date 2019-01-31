const router = require('express').Router();

const { getArticles, getArticleById, updateVote } = require('../controllers/article-controller');

router.route('/').get(getArticles);

router.route('/:article_id').get(getArticleById).patch(updateVote);

module.exports = router;
