exports.formatArticles = (article) => {
  const formattedArticles = article.map(({
    created_by, created_at, title, topic, body,
  }) => ({
    username: created_by,
    created_at: new Date(created_at),
    title,
    topic,
    body,


  }));
  return formattedArticles;
};

exports.articleRef = articles => articles.reduce((articleObj, articleCurr) => {
  articleObj[articleCurr.title] = articleCurr.article_id;


  return articleObj;
}, {});


exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(({
    created_at, created_by, belongs_to, body, votes,
  }) => ({
    created_at: new Date(created_at), username: created_by, article_id: articleRef[belongs_to], body, votes,
  }));
  return formattedComments;
};
