const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const {
  handle404,
  handle400,
  handle422,
  handle500,
  handle405,
} = require('./errors');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use(handle500);

module.exports = app;
