const apiObj = {
  '/api/topics': 'shows all topics available',
  '/api/topics/:topic/articles':
        'shows the articles associated with the selected topic',
  '/api/articles': 'shows all articles',
  '/api/articles/:article_id':
        'shows articles by selected id',
  '/api/articles/:article_id/comments':
        'shows all the comments associated with selected article',
  '/api/articles/:article_id/comments/:comment_id':
        'shows a specific comment associated with a selected article',
  '/api/users': 'displays all users',
  '/api/users/:username': 'shows a specific user by chosen username',
  '/api/users/:username/articles':
        'shows all the articles associated with a user',
};

module.exports = { apiObj };
