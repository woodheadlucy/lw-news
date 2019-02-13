const connection = require('../connection');

exports.insertNewComment = (username, body, article_id) => connection

  .insert({ username, body, article_id })
  .into('comments')
  .returning('*');


exports.modifyCommentVote = (inc_votes, article_id, comment_id) => connection('comments').where('comments.comment_id', '=', comment_id).where('comments.article_id', '=', article_id).increment('votes', inc_votes || 0)
  .returning('*');

exports.removeComment = (article_id, comment_id) => connection('comments')
  .where({ 'comments.article_id': article_id })
  .where({ 'comments.comment_id': comment_id })
  .del();
