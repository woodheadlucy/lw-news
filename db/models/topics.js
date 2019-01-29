// TOPIC MODEL!!!!

const connection = require('../connection');

exports.fetchTopics = () => connection.select('*').from('topics').returning('*');

exports.insertNewTopic = newTopic => connection.insert(newTopic).into('topics').returning('*');

exports.fetchTopicsByArticle = chosenTopic => connection('articles').select('*')
  .where({ topic: chosenTopic })
  .returning('*');
