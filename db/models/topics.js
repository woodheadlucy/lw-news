const connection = require('../connection');

exports.fetchTopics = () => connection
  .select('*')
  .from('topics')
  .returning('*');

exports.insertNewTopic = newTopic => connection
  .insert(newTopic)
  .into('topics')
  .returning('*');

exports.fetchArticlesByTopic = (
  topic,
  limit = 10,
  sort_by = 'created_at',
  p = 1,
  order = 'DESC',
) => connection
  .select(
    'articles.article_id',
    'articles.title',
    'articles.author',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
    'articles.body',
  )
  .count('comments.article_id AS comment_count')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ topic })
  .returning('*')
  .limit(limit)
  .offset((p - 1) * limit)
  .orderBy(sort_by, order);

exports.countArticlesByTopic = ({ topic }) => connection
  .select('topic')
  .count({ total_count: 'topic' })
  .from('articles')
  .rightJoin('topics', 'topics.slug', '=', 'articles.topic')
  .groupBy('topic')
  .where('articles.topic', '=', topic);


exports.insertNewArticle = (title, author, body, topic) => connection
  .insert({
    title,
    author,
    body,
    topic,
  })
  .into('articles')
  .where({ topic })
  .returning('*');
