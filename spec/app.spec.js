process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

const connection = require('../db/connection');


describe('/api', () => {
  // using a mocha hook beforeEach which will execute before every it block

  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  // adding destroy so the tests do not hang
  after(() => connection.destroy());

  // api/topics
  describe('/topics', () => {
    it('GET status: 200 responds with array of topic objects', () => request.get('/api/topics').expect(200).then((res) => {
      // console.log(res);
      // should be array
      // each obj should have a slug and desc property
      expect(res.body.topics).to.be.an('array');
      expect(res.body.topics[0]).to.contains.keys('slug', 'description');
    }));

    it('POST status: 201 responds with an object containing the posted topic', () => {
      const newTopic = {
        slug: 'teaTimeQuotes', description: 'a brew a day keeps the blues away',
      };
      return request.post('/api/topics').send(newTopic).expect(201).then((res) => {
        // console.log(res);
        // slug must be unique
        // contains posted object
        expect(res.body.topic).to.be.an('object');
        expect(res.body.topic).to.have.all.keys('slug', 'description');
        // console.log(res.body.topic);
        expect(res.body.topic).to.eql({ slug: 'teaTimeQuotes', description: 'a brew a day keeps the blues away' });
      });
    });
  });

  // api/topics/:topic/articles

  describe('/api/topics/:topic/articles', () => {
    it('GET status: 200 with the articles for a chosen topic', () => request.get('/api/topics/mitch/articles').expect(200).then((res) => {
      // console.log(res.body.articles[0].topic);
      expect(res.body.articles).to.be.an('array');
      expect(res.body.articles[0].topic).to.equal('mitch');
      expect(res.body.articles[0]).to.have.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic', 'body');
    }));

    // LIMIT
    it('GET status: 200 will limit to 10 responses (DEFAULT CASE)', () => request.get('/api/topics/mitch/articles').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(10);
    }));
    it('GET status: 200 takes a limit query to change the number of articles returned', () => request.get('/api/topics/mitch/articles?limit=5').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(5);
    }));
    // SORT_BY
    // failing atm
    it('GET status: 200 will sort by the date created (DEFAULT CASE)', () => {
      request.get('/api/topics/mitch/articles').expect(200)
        .then(({ body }) => expect(body.articles[0].created_at).to.equal('2018-05-30 16:59:13.341+01'));
    });
    it('GET status: 200 can change the sort column to title', () => request.get('/api/topics/mitch/articles?sort_by=title').expect(200).then(({ body }) => {
      // console.log(body.articles);
      expect(body.articles[0].title).to.equal('Z');
      expect(body.articles[9].title).to.equal('Am I a cat?');
    }));
    // PAGINATION
    it('GET status: 200 will specify the page which to start at with 10 articles (DEFAULT CASE)', () => request.get('/api/topics/mitch/articles?p=2').expect(200).then(({ body }) => {
      // console.log(body.articles, '<<<<< ');
      expect(body.articles).to.have.length(1);
    }));
    it('GET status: 200 will specify the page which contains the limited number of articles', () => request.get('/api/topics/mitch/articles?p=2&limit=6').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(5);
    }));

    // ORDER BY
    it('GET status:200 and sorts a column by the order specified', () => request.get('/api/topics/mitch/articles?sort_by=article_id&order=asc').expect(200).then(({ body }) => {
      // console.log(Object.keys(body.articles[1]));
      expect(body.articles[0].article_id).to.equal(1);
    }));
    // POST REQ
    it('POST status: 201 and returns the new article', () => {
      const newArticle = {
        title: 'tomato ketchup',
        author: 'icellusedkars',
        body: 'ketchup and gravy on christmas dinner',
      };
      return request.post('/api/topics/mitch/articles').send(newArticle).expect(201).then((res) => {
        expect(res.body.article.title).to.equal('tomato ketchup');
      });
    });

    // TOTAL COUNT
  });


  describe('/articles', () => {
    // ALL ARTICLES

    // SHOULD THIS BE IN A NEW NESTED DESCRIBE BLOCK?!!
    it('GET status: 200 with an array of article objects', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles).to.be.an('array');

      expect(res.body.articles[0]).to.contains.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic', 'body');
    }));


    // LIMIT ON ARTICLES

    it('GET status: 200 will limit to 10 responses (DEFAULT CASE)', () => request.get('/api/articles').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(10);
    }));
    it('GET status: 200 takes a limit query to change the number of articles returned', () => request.get('/api/articles?limit=5').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(5);
    }));

    // SORT BY ARTICLES
    it('GET status: 200 will sort by the date created (DEFAULT CASE)', () => {
      request.get('/api/articles').expect(200).then(({ body }) => {
        expect(body.articles[0].created_at).to.equal('2018-05-30 16:59:13.341+01');
      });
    });
    it('GET articles status: 200 can change the sort column to title', () => request.get('/api/articles?sort_by=title').expect(200).then(({ body }) => {
      // console.log(body.articles);
      expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      // expect(body.articles[2].title).to.equal('Eight pug gifs that remind me of mitch');
    }));

    // PAGINATION ARTICLES
    it('GET status: 200 will specify the page which to start at with 10 articles (DEFAULT CASE)', () => request.get('/api/articles?p=2').expect(200).then(({ body }) => {
      // console.log(body.articles, 'pagination');
      expect(body.articles).to.have.length(10);
    }));
    it('GET status: 200 will specify the page which contains the limited number of articles', () => request.get('/api/articles?p=2&limit=6').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(6);
    }));

    // ORDER BY
    it('GET status:200 and sorts a column by the order specified', () => request.get('/api/articles?sort_by=article_id&order=asc').expect(200).then(({ body }) => {
      // console.log(Object.keys(body.articles[1]));
      expect(body.articles[0].article_id).to.equal(1);
    }));

    // ARTICLE ID
    describe('/articles/:article_id', () => {
      it('GET status: 200 returns an article object', () => request.get('/api/articles/2').expect(200).then((res) => {
        // console.log(res.body.article, 'test<<');
        expect(res.body.article.article_id).to.equal(2);
        expect(res.body.article).to.be.an('object');
        expect(res.body.article).to.contains.keys('article_id', 'author', 'title', 'votes', 'body', 'comment_count', 'created_at', 'topic');
      }));
      it('PATCH status: 200 can increment the votes on an article and respond with updated article', () => {
        const newVote = 1;
        return request.patch('/api/articles/1').send({ inc_votes: newVote }).expect(200).then(({ body }) => {
          // console.log(body.article.votes, '<<< votes');
          expect(body.article.votes).to.equal(1);
        });
      });
      it('PATCH status 200 returns the article with the vote unchanged', () => {
        const newVote = 0;
        return request.patch('/api/articles/1').send({ inc_votes: newVote }).expect(200).then(({ body }) => {
          // console.log(body.article.votes, '<<< votes');
          expect(body.article.votes).to.equal(0);
        });
      });
      it('PATCH status 200 downvotes an article', () => {
        const newVote = -2;
        return request.patch('/api/articles/1').send({ inc_votes: newVote }).expect(200).then(({ body }) => {
          // console.log(body.article.votes, '<<< votes');
          expect(body.article.votes).to.equal(-2);
        });
      });
      // DELETE AN ARTICLE BY ID


      it('DELETE status: 204 removes an article by id', () => request.delete('/api/articles/3').expect(204));
    });


    describe('/api/articles/:article_id/comments', () => {
      it('GET status: 200 and returns the comments associated with the chosen article', () => request.get('/api/articles/9/comments').expect(200).then(({ body }) => {
        console.log(body.comments[0], '<<< test');
        expect(body.comments).to.be.an('array');
        expect(body.comments[0]).to.contains.keys('comment_id', 'votes', 'created_at', 'username', 'body');
      }));

      // LIMITS ON COMMENTS
      it('GET status: 200  ');
    });
  });
});
// ////// USERS
// xdescribe('/users', () => {
//   it('GET status: 200 with an array of user objects', () => request.get('/api/users').expect(200).then((res) => {
//     expect(res.body.users).to.be.an('array');
//     // console.log(res.body.users);
//     expect(res.body.users.length).to.equal(3);
//   }));
//   it('POST status: 201 sends a new user object', () => {
//     const newUser = {
//       avatar_url: 'www.google.com/1o3i4h123',
//       name: 'lucy woodhead',
//       username: 'woo100',


//     };
//     return request.send(newUser)
//       .expect(201)
//       .then((res) => {
//         expect(res.body.user).to.be.an('object');
//         expect(res.body.user.username).to.eql('woo100');
//       });
//   });
// });
//   describe('/users/:username', () => {
//     it('GET should return 200 and an array of user objects', () => request.get('/api/users/1')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body).to.be.an('object');
//         expect(body).to.have.all.keys('avatar_url', 'name', 'username');
//       }));
//   });

// // test errors!
// it('GET status: 404 client uses non-existent article ID', () => request.get('/api/articles/321').expect(404));

// it('GET status: 400 (Bad request) client uses invalid id', () => request.get('/'))
