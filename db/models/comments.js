const connection = require('../connection');


exports.insertNewComment = newComment => connection.insert(newComment).into('comments').returning('*');


// / 2 parametric things in SQL
// check if articl exists
exports.modifyCommentVote = (article_id, comment_id, inc_votes) => connection('comments').where({ article_id, comment_id }).increment({ inc_votes })
  .returning('*');

// exports.removeComment = ()

// dealing with two where statements in knex
