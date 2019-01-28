const { articles } = require('../data/test-data/articles)';

const newArticle = (articles) => {
    articles.map(({ created_by, created_at, ...restOfArticle }) => {
        return { 'username': created_by, 'created_at': new Date(created_at), ...restOfArticle }
    })
};

module.exports = newArticle;