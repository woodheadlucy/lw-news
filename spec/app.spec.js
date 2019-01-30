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


    it('GET status: 200 will limit to 10 responses (DEFAULT CASE)', () => request.get('/api/topics/mitch/articles').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(10);
    }));
    it('GET status: 200 takes a limit query to change the number of articles returned', () => request.get('/api/topics/mitch/articles?limit=5').expect(200).then(({ body }) => {
      expect(body.articles).to.have.length(5);
    }));
    it('GET status: 200 will sort by the date created (DEFAULT CASE)', () => {
      request.get('/api/topics/mitch/articles').expect(200).then(({ body }) => {
        expect(body.articles[0].created_at.to.equal('2018 - 05 - 30 16: 59: 13.341 + 01'));
      });
    });
    it('GET status: 200 can change the sort by topic', () => request.get('api/topics/mitch/articles?sort_by=title').expect(200).then(({ body }) => {
      // SORT THIS AFTER LUNCH console.log(body.articles[0], '<<<<<<<<<<');
      expect(body.articles[0].title).to.equal('22 Amazing open source React projects');
    }));
  });
});


// // test errors!
// it('GET status: 404 client uses non-existent article ID', () => request.get('/api/articles/321').expect(404));

// it('GET status: 400 (Bad request) client uses invalid id', () => request.get('/'));
