// ARTICLES MODEL!!!!!
const connection = require('../connection');


exports.fetchArticles = (defaultLimit = 10, defaultSort = 'created_at', defaultPage = 1, defaultOrder = 'DESC') => connection.select('articles.article_id', 'articles.title', 'articles.author', 'articles.votes', 'articles.created_at', 'articles.topic', 'articles.body').count('comments.article_id AS comment_count').leftJoin('comments', 'comments.article_id', '=', 'articles.article_id').groupBy('articles.article_id')
  .from('articles')
  .returning('*')
  .limit(defaultLimit)
  .offset((defaultPage - 1) * defaultLimit)
  .orderBy(defaultSort, defaultOrder);


exports.fetchArticleById = chosenArtId => connection.select('articles.article_id', 'articles.title', 'articles.author', 'articles.votes', 'articles.created_at', 'articles.topic', 'articles.body').count('comments.article_id AS comment_count').leftJoin('comments', 'comments.article_id', '=', 'articles.article_id').from('articles')
  .groupBy('articles.article_id')
  .where({ 'articles.article_id': chosenArtId })
  .returning('*');


exports.insertNewArticle = newArticle => connection.insert(newArticle)
  .into('articles').returning('*');
