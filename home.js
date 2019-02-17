const apiObj = {
  '/api/topics': {
    GET: 'shows all topics available',
    POST: 'allows a new topic to be added {slug, description}',
  },
  '/api/topics/:topic/articles': {
    GET:
      'shows the articles associated with the selected topic, also takes queries on limit, sort_by, order, and p(page)',
    POST: 'allows a new article to be added {title, body, author} and topic_id',
  },
  '/api/articles': {
    GET:
      'shows all articles, also takes queries on limit, sort_by, order, and p(page)',
  },
  '/api/articles/:article_id': {
    GET: 'shows articles by selected id',
    PATCH: 'allows user to vote {inc_votes} with an integer',
    DELETE: 'deletes article with article_id and responds with no content',
  },
  '/api/articles/:article_id/comments': {
    GET:
      'shows all the comments associated with selected article, also takes queries on limit, sort_by, order, and p(page)',
    POST: 'takes a {username, body} and adds to the specifid article_id',
  },
  '/api/articles/:article_id/comments/:comment_id': {
    PATCH: 'accepts votes {inc_votes} when an integet is passed and increments',
    DELETE:
      'deletes a comment specified by the comment_id and responds with no content',
  },
  '/api/users': {
    GET: 'displays all users',
    POST: 'allows a new user to be added {username, avatar_url, name}',
  },

  '/api/users/:username': {
    GET: 'shows a specific user by chosen username',
  },

  '/api/users/:username/articles': {
    GET:
      'shows all the articles associated with a user, also takes queries on limit, sort_by, order, and p(page)',
  },
};

module.exports = { apiObj };
