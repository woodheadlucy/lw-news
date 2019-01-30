const router = require('express').Router();

const { getArticles } = require('../controllers/article-controller');

router.route('/').get(getArticles);
module.exports = router;
