process.env.NODE_ENV = 'test';
const request = require('supertest')(app);
const { expect } = require('chai');
const app = require('../app');
const connection = require('../db/connection');

describe('/api', () => {
  // using a mocha hook beforeEach which will execute before every it block

  beforeEach(() => {
    connection.migrate.rollback().then(() => {
      connection.migrate.latest().then(() => {
        connection.seed.run();
      });
    });

    // adding destroy so the tests do not hang
    after(() => connection.destroy());


    describe('/', () => {
      it('GET status: 200 responds with array of objects', () => request.get('/api/users').expect(200).then(({ body }) => {
        expect(body.articles).to.be.an('array');
      }));
    });

    // parametric end point
    describe('/x/:x_id', () => {
      it('GET status: 200 responds with object', () => request.get('/api/x/y').expect(200).then(({ body }) => {
        expect(body.x.y).to.equal('');
      }));
    });

    // test errors!
    it('GET status: 404 client uses non-existent article ID', () => request.get('/api/articles/321').expect(404));

    it('GET status: 400 (Bad request) client uses invalid id', () => request.get('/'));
  });
});
