const router = require('express').Router();

const { getArticles, getArticleById } = require('../controllers/article-controller');

router.route('/').get(getArticles);

router.route('/:article_id').get(getArticleById);
module.exports = router;
