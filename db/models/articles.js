
const connection = require('../connection');


exports.fetchArticles = (defaultLimit = 10, defaultSort = 'created_at', defaultPage = 1, defaultOrder = 'DESC') => connection.select('articles.*').count('comments.article_id AS comment_count').leftJoin('comments', 'comments.article_id', '=', 'articles.article_id').groupBy('articles.article_id')
  .from('articles')
  .returning('*')
  .limit(defaultLimit)
  .offset((defaultPage - 1) * defaultLimit)
  .orderBy(defaultSort, defaultOrder);

exports.countArticles = () => connection('articles').count('article_id').then(([{ count }]) => +count);

exports.fetchArticleById = chosenArtId => connection.select('articles.*').count('comments.article_id AS comment_count').leftJoin('comments', 'comments.article_id', '=', 'articles.article_id').from('articles')
  .groupBy('articles.article_id')
  .where({ 'articles.article_id': chosenArtId })
  .returning('*');


exports.insertNewArticle = (title, author, body, topic) => connection.insert({ title, author, body }, { topic }).into('articles').where({ topic })
  .returning('*');


exports.modifyVote = (article_id, inc_votes) => connection('articles').where({ article_id }).increment('votes', inc_votes).returning('*');


exports.removeArticle = chosenArticleDelete => connection('articles').where(chosenArticleDelete).del();


exports.fetchComments = (article_id, limit = 10, sort_by = 'created_at', order = 'DESC', p = 1) => connection.select('*').from('comments').where({ article_id })

  .offset((p - 1) * limit)
  .orderBy(sort_by, order)
  .limit(limit);
