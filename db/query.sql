\c nc_news;
\dt

--SELECT * FROM articles;

SELECT articles.article_id, articles.title, articles.author, articles.votes, articles.created_at, articles.topic, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  GROUP BY articles.article_id ORDER BY articles.title ASC;



