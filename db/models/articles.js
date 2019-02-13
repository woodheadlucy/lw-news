const connection = require('../connection');

exports.fetchArticles = (
  limit = 10,
  sort_by = 'created_at',
  p = 1,
  order = 'DESC',
) => connection
  .select('articles.*')
  .count('comments.article_id AS comment_count')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .from('articles')
  .returning('*')
  .limit(limit)
  .offset((p - 1) * limit)
  .orderBy(sort_by, order);

exports.countArticles = () => connection('articles')
  .count('article_id')
  .then(([{ count }]) => +count);

exports.fetchArticleById = chosenArtId => connection
  .select('articles.*')
  .count('comments.article_id AS comment_count')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ 'articles.article_id': chosenArtId })
  .returning('*');


exports.modifyVote = (article_id, inc_votes) => connection('articles')
  .where({ article_id })
  .increment('votes', inc_votes || 0)
  .returning('*');

exports.removeArticle = chosenArticleDelete => connection('articles')
  .where({ article_id: chosenArticleDelete })
  .del();

exports.fetchComments = (
  article_id,
  limit = 10,
  sort_by = 'created_at',
  order = 'DESC',
  p = 1,
) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .limit(limit)
  .offset((p - 1) * limit)
  .orderBy(sort_by, order);
