const {
  articleData,
  commentData,
  topicData,
  userData,
} = require('../data/index');

const newArticle = require('../data/utils/utils');

exports.seed = (connection, Promise) => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('users')
        .insert(userData)
        .returning('*'),)
    .then(() => connection('topics')
        .insert(topicData)
        .returning('*'),)
    .then(() => connection('articles')
        .insert(articleData)
        .returning('*'),);
