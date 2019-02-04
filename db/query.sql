\c nc_news_test;
\dt

--SELECT * FROM articles DEL article_id = 3;
--SELECT * FROM articles GROUP BY articles.article_id ORDER BY articles.title DESC LIMIT 3;
--SELECT comments.created_at, comments.article_id FROM comments JOIN articles ON comments.article_id = comments.article_id WHERE articles.article_id = 1 GROUP BY comments.created_at ORDER BY comments.created_at DESC LIMIT 4;


--SELECT * FROM comments WHERE comments.article_id = 1 ORDER BY comments.created_at DESC LIMIT 4 


--SELECT comments.comment_id, comments.body, comments.created_at, comments.votes FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = 1  ORDER BY comments.created_at DESC, comments.votes ASC LIMIT 16;


--SELECT * FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE comments.username = 'icellusedkars';

--SELECT * FROM articles WHERE articles.author = 'icellusedkars' ORDER BY articles.created_at;

--SELECT * FROM COMMENTS WHERE comments.article_id = 9 AND comments.comment_id = 1;

SELECT * FROM articles WHERE articles.author = 'butter_bridge';