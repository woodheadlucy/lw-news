const connection = require('../connection');

exports.insertNewComment = newComment => connection
  .insert(newComment)
  .into('comments')
  .returning('*');


exports.modifyCommentVote = (inc_votes, article_id, comment_id) => connection('comments').where('comments.comment_id', '=', comment_id).where('comments.article_id', '=', article_id).increment('votes', inc_votes)
  .returning('*');

exports.removeComment = (article_id, comment_id) => connection('articles')
  .where(article_id)
  .where(comment_id)
  .del();
