\c nc_news_test;
\dt

--SELECT * FROM articles;

SELECT articles.article_id, articles.title, articles.author, articles.votes, articles.created_at, articles.topic, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE articles.topic = 'mitch' GROUP BY articles.article_id ORDER BY articles.created_at DESC;



