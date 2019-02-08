process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    it('GET status: 200 responds with array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.contains.keys('slug', 'description');
      }));

    it('POST status: 201 responds with an object containing the posted topic', () => {
      const newTopic = {
        slug: 'teaTimeQuotes',
        description: 'a brew a day keeps the blues away',
      };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an('object');
          expect(body.topic).to.have.all.keys('slug', 'description');

          expect(body.topic).to.eql({
            slug: 'teaTimeQuotes',
            description: 'a brew a day keeps the blues away',
          });
        });
    });

    it('DELETE status: 405 for invalid methods', () => request.delete('/api/topics').expect(405));
    it('PUT status: 405 for invalid methods', () => request.put('/api/topics').expect(405));
    it('PATCH status: 405 for invalid methods', () => request.patch('/api/topics').expect(405));

    it('POST status: 422 when a request with a duplicate slug has been made ', () => {
      const dodgyPost = {
        slug: 'mitch',
        description: 'woopadoodle',
      };
      return request
        .post('/api/topics')
        .send(dodgyPost)
        .expect(422)
        .then(({ body }) => {
          expect(body.message).to.eql('name already exists');
        });
    });

    it('POST status: 400 if the request is not in the correct format', () => {
      const dodgyPost = {
        slug: 'bbqsauce',
        condiments: 'ketchup',
      };
      return request
        .post('/api/topics')
        .send(dodgyPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal('invalid input');
        });
    });

    it('POST status: 400 if the new topic object is missing a description', () => {
      const dodgyPost = { slug: 'sluggy' };
      return request
        .post('/api/topics')
        .send(dodgyPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal('invalid input, column does not exist');
        });
    });
  });
  describe('/topics/:topic/articles', () => {
    it('GET status: 200 with the articles for a chosen topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].topic).to.equal('mitch');
        expect(body.articles[0]).to.have.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
          'body',
        );
      }));

    it('GET status: 200 returns the total number of articles for a selected topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.contain.keys('total_count');

        expect(body.total_count[0].total_count).to.equal('11');
      }));

    it('GET status: 404 if the topic does not exist', () => request.get('/api/topics/!!2ft/articles').expect(404));

    it('GET status: 200 will limit to 10 responses (DEFAULT CASE)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
      }));
    it('GET status: 200 takes a limit query to change the number of articles returned', () => request
      .get('/api/topics/mitch/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(5);
      }));

    it('GET status: 200 will sort by the date created (DEFAULT CASE)', () => {
      request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => expect(body.articles[0].created_at).to.equal(
          '2018-05-30 16:59:13.341+01',
        ));
    });
    it('GET status: 200 will default to created_at sort when an invalid sort query is made', () => request
      .get('/api/topics/mitch/articles?sort_by=ketchup')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].created_at).to.equal(
          '2018-11-15T12:21:54.171Z',
        );
      }));
    it('GET status: 200 can change the sort column to title', () => request
      .get('/api/topics/mitch/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[9].title).to.equal('Am I a cat?');
      }));

    it('GET status: 200 will specify the page which to start at with 10 articles (DEFAULT CASE)', () => request
      .get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(1);
      }));
    it('GET status: 200 will specify the page which contains the limited number of articles', () => request
      .get('/api/topics/mitch/articles?p=2&limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(5);
      }));

    it('GET status:200 and sorts a column by the order specified', () => request
      .get('/api/topics/mitch/articles?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(1);
      }));

    it('POST status: 201 and returns the new article', () => {
      const newArticle = {
        title: 'tomato ketchup',
        author: 'icellusedkars',
        body: 'ketchup and gravy on christmas dinner',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.title).to.equal('tomato ketchup');
        });
    });

    it('POST status: 400 bad request if the author does not exist in the database', () => {
      const dodgyArticle = {
        title: 'lucy in the sky',
        body: 'with diamonds',
        author: 'lw2019',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(dodgyArticle)
        .expect(400);
    });

    it('POST status: 400 when the article has no author', () => {
      const dodgyArticle = {
        title: 'ketchup',
        body: 'accessorheinz',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(dodgyArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal('invalid input, column does not exist');
        });
    });
    it('GET status: 404 when the topic name does not exist in the database', () => request.get('/api/topics/lucyyy/articles').expect(404));

    it.only('POST status: 404 when trying to post a new article to a non-existent topic', () => request
      .post('/api/topics/lucywoo10/articles')
      .send({ title: 'omg', body: 'coding all day', author: 'icellusedkars' })
      .expect(404));

    it('PUT status: 405 handles invalid requests', () => request.put('/api/topics/cats/articles').expect(405));
    it('DELETE status: 405 handles invalid requests', () => request.delete('/api/topics/cats/articles').expect(405));
    it('PATCH status: 405 handles invalid requests', () => request.patch('/api/topics/cats/articles').expect(405));
  });

  describe('/articles', () => {
    it('GET status: 200 returns the total number of articles', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.contain.keys('total_count');
        expect(body.total_count).to.equal(12);
      }));

    it('GET status: 405 for invalid methods', () => request.delete('/api/articles').expect(405));
    it('PATCH status: 405 for invalid methods', () => request.patch('/api/articles'));
    it('GET status: 200 with an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');

        expect(body.articles[0]).to.contains.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
          'body',
        );
      }));

    it('GET status: 200 will limit to 10 responses (DEFAULT CASE)', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
      }));
    it('GET status: 200 takes a limit query to change the number of articles returned', () => request
      .get('/api/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(5);
      }));

    it('GET status: 200 will sort by the date created (DEFAULT CASE)', () => {
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].created_at).to.equal(
            '2018-05-30 16:59:13.341+01',
          );
        });
    });

    it('GET status: 200 can change the sort column to title', () => request
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
      }));

    it('GET status: 200 will specify the page which to start at with 10 articles (DEFAULT CASE)', () => request
      .get('/api/articles?p=1')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
      }));
    it('GET status: 200 will specify the page which contains the limited number of articles', () => request
      .get('/api/articles?p=2&limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(6);
      }));

    it('GET status:200 and sorts a column by the order specified', () => request
      .get('/api/articles?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(1);
      }));
  });

  describe('/articles/:article_id', () => {
    it('GET status: 200 returns an article object', () => request
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).to.equal(2);
        expect(body.article).to.be.an('object');
        expect(body.article).to.contains.keys(
          'article_id',
          'author',
          'title',
          'votes',
          'body',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('GET status: 404 when an invalid article id is entered', () => request.get('/api/articles/10000007').expect(404));
    it('GET status: 400 when a non-number is entered as an id', () => {
      request.get('/api/articles/lucyfromleeds').expect(400);
    });
    it('PATCH status: 200 can increment the votes on an article and respond with updated article', () => {
      const newVote = 1;
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(101);
        });
    });
    it('PATCH status 200 returns the article with the vote unchanged', () => {
      const newVote = 0;
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(100);
        });
    });
    it('PATCH status 200 downvotes an article', () => {
      const newVote = -2;
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(98);
        });
    });
    it('PATCH status: 400 if given invalid input for incrementing votes', () => {
      const newVote = 'burger';
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: newVote })
        .expect(400);
    });

    it('DELETE status: 204 removes an article by id', () => request.delete('/api/articles/3').expect(204));
    it('DELETE status: 404 when an attempt to delete a non-existent article id is made', () => request.delete('/api/articles/6500').expect(404));
    it('POST status: 405 handles invalid requests', () => {
      request.post('/api/articles/94').expect(405);
    });
    it('PUT status: 405 handles invalid requests', () => request.put('/api/articles/1').expect(405));
  });

  describe('/articles/:article_id/comments', () => {
    it('GET status: 200 and returns the comments associated with the chosen article', () => request
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');

        expect(body.comments[0]).to.contains.keys(
          'comment_id',
          'votes',
          'created_at',
          'username',
          'body',
        );
      }));

    it('GET status: 404 when an attempt to get comments for a non-existent article id is made', () => request.get('/api/articles/32974623947/comments').expect(404));
    it('POST status: 404 when given a non existent article id', () => {
      const newComment = {
        username: 'icellusedkars',
        body: 'lemon difficult',
      };

      return request.post('/api/articles/2309482309u/comments').send(newComment).expect(404);
    });

    it('POST status: 422 when an attempt to post with a non-existent author', () => {
      const newComment = {
        username: 'woodhel02',
        body: 'bamboozled',
      };
      return request.post('/api/articles/1/comments').send(newComment).expect(422);
    });

    it('GET status: 200 will limit to 10 comments (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(10);
      }));
    it('GET status: 200 takes a limit query to change the number of comments', () => request
      .get('/api/articles/1/comments?limit=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(4);
      }));

    // unsure if this is correct
    it('GET status: 200 will sort the comments by the date they were submitted (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].created_at).to.equal(
          '2016-11-22T12:36:03.389Z',
        );
      }));
    it('GET status: 200 can change the sort by on the comments of the article', () => request
      .get('/api/articles/1/comments?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].votes).to.equal(100);
      }));
    // it.only('GET status: 200 can change the sort by on the comments of the article', () => {
    //   request.get('/api/articles/1/comments?sort_by=body').expect(200).then(({ body }) => {
    //     console.log(body);
    //     expect(body.comments[0].body).to.equal('haha');
    //   });

    // does not work :()
    it('GET status: 200 can take a query to sort by username (DEFAULT ORDER DESC)', () => request
      .get('/api/articles/1/comments?sort_by=username')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].username).to.equal('icellusedkars');
      }));

    it('GET status: 200 will specify the page which to start at with 10 comments (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(10);
      }));


    // why is the offset not working
    it('GET status: 200 will specify the page which to start at with a number of comments', () => request
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(3);
      }));
    it('GET status: 200 will specify the page which contains the limited number of comments starts at', () => request
      .get('/api/articles/1/comments?p=2&limit=8')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(8);
        // expect(body.comments[0].body).to.equal()
      }));

    it('GET status: 200 and sorts the column by the order specified (DEFAULT DESC)', () => request
      .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].comment_id).to.equal(2);
        expect(body.comments).to.have.length(10);
      }));

    it('POST status: 201 adds a new comments to an article', () => {
      const newComment = {
        username: 'icellusedkars',
        body: 'this article changed my life xoxo',
      };
      return request
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.body).to.equal(
            'this article changed my life xoxo',
          );
        });
    });


    it('PUT status: 405 handles invalid requests', () => request.put('/api/articles/3/comments').expect(405));
    it('DELETE status: 405 handles invalid requests', () => request.delete('/api/articles/3/comments').expect(405));
    it('PATCH status: 405 handles invalid requests', () => request.patch('/api/articles/3/comments').expect(405));
  });

  describe('/articles/:article_id/comments/:comment_id', () => {
    it('PATCH status: 200 can increment the votes on a article comment and respond with updated comment', () => {
      const newVote = 30;
      return request
        .patch('/api/articles/1/comments/18')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(46);
        });
    });
    it('PATCH status: 200 returns the article comment with the vote unchanged', () => {
      const newVote = 0;
      return request
        .patch('/api/articles/1/comments/18')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
        });
    });
    it('PATCH status: 200 downvotes an article comment', () => {
      const newVote = -4;
      return request
        .patch('/api/articles/1/comments/18')
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(12);
        });
    });

    // check that this is what is meant by no body
    it('PATCH status: 200 if no body is given to the vote', () => {
      let newVote;
      return request.patch('/api/articles/1/comments/18').send({ inc_votes: newVote }).expect(200);
    });
    it('PATCH status: 404 when a non-existent article id is used', () => request.patch('/api/articles/234092842/comments/1').expect(404));
    it('PATCH status: 400 if given invalid vote input', () => {
      const newVote = 'hotdogs';
      return request
        .patch('/api/articles/1/comments/18')
        .send({ inc_votes: newVote })
        .expect(400);
    });
    it('PATCH status: 400 if an attempt to vote on an invalid article is made', () => {
      const newVote = 30;
      return request
        .patch('/api/articles/88989/comments/1')
        .send({ inc_votes: newVote })
        .expect(400);
    });
    it('PATCH status: 400 when an invalid comment id is passed', () => {
      const newVote = 30;
      return request
        .patch('/api/articles/1/comments/509')
        .send({ inc_votes: newVote })
        .expect(400);
    });

    it('DELETE status: 204 removes a comment from an article by its ID', () => {
      request.delete('/api/articles/1/comments/1').expect(204);
    });

    it('PUT status: 405 handles invalid requests', () => request.put('/api/articles/1/comments/1').expect(405));
    it('GET status: 405 handles invalid requests', () => request.get('/api/articles/1/comments/1').expect(405));
    it('POST status: 405 handles invalid requests', () => request.post('/api/articles/1/comments/1').expect(405));


    it('PATCH status: 404 if invalid comment id is used', () => {
      const newComment = {
        username: 'icellusedkars',
        body: 'haalp',
      };
      request.patch('/api/articles/1/haha12').send(newComment).expect(404);
    });
    it('DELETE status: 404 when an attempt to delete a comment on a non existent article is made', () => request.delete('/api/articles/8707/comments/1').expect(404));
    it('DELETE status: 404 when an attempt to delete comments on a non-existent comment id is made', () => request.delete('/api/articles/1/comments/909').expect(404));
  });

  describe('/users', () => {
    it('GET status: 200 with an array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.be.an('array');

        expect(body.users.length).to.equal(3);
        expect(body.users[0]).to.contains.keys(
          'username',
          'avatar_url',
          'name',
        );
      }));

    it('DELETE status: 405 for invalid methods', () => request.delete('/api/users').expect(405));
    it('PATCH status: 405 for invalid methods', () => request.patch('/api/users').expect(405));
    it('PUT status: 405 handles invalid methods', () => request.put('/api/users').expect(405));
    it('POST status: 201 sends a new user object', () => {
      const newUser = {
        avatar_url: 'www.google.com/1o3i4h123',
        name: 'lucy woodhead',
        username: 'woo1000000',
      };
      return request
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          expect(body.user).to.be.an('object');
          expect(body.user.username).to.eql('woo1000000');
        });
    });
  });

  describe('/users/:username', () => {
    it('GET status: 200 returns a user object', () => request
      .get('/api/users/icellusedkars')
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).to.equal('icellusedkars');
        expect(body.user).to.contains.keys('username', 'avatar_url', 'name');
      }));
    it('GET status: 404 if a username does not exist in the database', () => request.get('/api/users/lalalalalucy').expect(404));

    it('PUT status: 405 handles invalid requests', () => request.put('/api/users/icellusedkars').expect(405));
    it('DELETE status: 405 handles invalid requests', () => request.delete('/api/users/icellusedkars').expect(405));
    it('PATCH status: 405 handles invalid requests', () => request.patch('/api/users/icellusedkars').expect(405));
    it('POST status: 405 handles invalid requests', () => request.post('/api/users/icellusedkars').expect(405));
  });

  describe('/users/:username/articles', () => {
    it('GET status: 200 returns an array of article objects by the given user', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.contains.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));

    it('GET status: 200 returns the total number of articles by user', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count[0]).to.contain.keys('total_count');
        expect(body.total_count[0].total_count).to.equal('6');
      }));

    it('GET status: 200 returns a limited number of articles belonging to a user (DEFUALT CASE)', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(6);
      }));
    it('GET status: 200 accepts a query to return a limited number of articles of a user', () => request
      .get('/api/users/icellusedkars/articles?limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(2);
      }));

    it('GET status: 200 will sort the articles by the date created (DEFAULT CASE)', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].created_at).to.equal(
          '2014-11-16T12:21:54.171Z',
        );
      }));
    it('GET status: 200 can change the sort on articles by votes', () => request
      .get('/api/users/icellusedkars/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(2);
      }));

    it('GET status: 200 will specify the page which to start at with 10 articles (DEFAULT CASE)', () => request
      .get('/api/users/butter_bridge/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
      }));
    it('GET status: 200 will specify the page which contains the limited number of comments starts at', () => request
      .get('/api/users/butter_bridge/articles?p=1&limit=1')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(1);
      }));

    it('GET status: 200 and sorts the column by the order specified (DEFAULT DESC)', () => request
      .get('/api/users/butter_bridge/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal(
          "They're not exactly dogs, are they?",
        );
      }));
    it('GET status: 200 and sorts the column by the order specified', () => request
      .get('/api/users/butter_bridge/articles?sort_by=title&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal(
          'Living in the shadow of a great man',
        );
      }));
  });

  describe('/api', () => {
    it('GET a json of all the endpoints', () => request
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.apiObj).to.have.all.keys(
          '/api/topics',
          '/api/topics/:topic/articles',
          '/api/articles',
          '/api/articles/:article_id',
          '/api/articles/:article_id/comments',
          '/api/articles/:article_id/comments/:comment_id',
          '/api/users',
          '/api/users/:username',
          '/api/users/:username/articles',
        );
      }));
  });
});
