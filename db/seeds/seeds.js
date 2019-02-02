const {
  articleData,
  commentData,
  topicData,
  userData,
} = require('../data/index');

const {
  articleRef, formatArticles, formatComments,
} = require('../utils/utils');


exports.seed = (connection, Promise) => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection('users')
    .insert(userData)
    .returning('*'))
  .then(() => connection('topics')
    .insert(topicData)
    .returning('*'))
  .then(() => {
    const formattedArticles = formatArticles(articleData);
    return Promise.all([connection('articles').insert(formattedArticles).returning('*'),
    ]);
  })
  .then(([articleRows]) => {
    const articlesLookup = articleRef(articleRows);

    const formattedComms = formatComments(commentData, articlesLookup);

    return connection('comments').insert(formattedComms).returning('*');
  });
