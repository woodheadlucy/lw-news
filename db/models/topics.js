// TOPIC MODEL!!!!

const connection = require('../connection');

exports.fetchTopics = () => connection.select('*').from('topics').returning('*');

exports.insertNewTopic = newTopic => connection.insert(newTopic).into('topics').returning('*');

exports.fetchTopicsByArticle = (chosenTopic, defaultLimit = 10, defaultSort = 'created_at') => connection.select('articles.article_id', 'articles.title', 'articles.author', 'articles.votes', 'articles.created_at', 'articles.topic', 'articles.body').count('comments.article_id AS comment_count').leftJoin('comments', 'comments.article_id', '=', 'articles.article_id').from('articles')
  .groupBy('articles.article_id')
  .where({ topic: chosenTopic })
  .returning('*')
  .limit(defaultLimit)
  .orderBy(defaultSort, 'ASC');
