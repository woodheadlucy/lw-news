# NC KNEWS

This is a news API where a front-end will be built. It includes topics, articles, article comments, and users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This API will need PostgreSQL.

### Installing

Fork and clone the repository

Install the dependencies

```
npm install
```

Create a knex.js file so knex can work with the database

```
knex.js
```

Your knex.js file should look like this:

```
module.exports={
    development:{
        client:'pg',
        connection:{
            database: 'nc_news',
            user: '<YOUR USERNAME(LINUX ONLY)>',
            password: '<YOUR PASSWORD(LINUX ONLY)>'
        },
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
}
```

## Running the tests

Tests can be run with mocha and chai by using `npm t`. When this command is executed it will drop and re-create the databse before each test.

The tests assert the request status and response:

```
it('GET status: 200 responds with array of topic objects', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics[0]).to.contains.keys('slug', 'description');
        }));
```



## Built With

- Express
- Knex
- Supertest
- Mocha

## Acknowledgments

- Northcoders
