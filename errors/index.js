exports.handle400 = (err, req, res, next) => {
  console.log(err, '<<<');
  const { code } = err;
  const errorCodes400 = {
    '22P02': 'invalid input syntax for integer',
    23503: 'not found',
    23505: 'name already exists',
    42703: 'invalid input',
    23502: 'invalid input, column does not exist',
  };
  if (
    (errorCodes400[code] && err.constraint !== 'topics_pkey')
    || err.status === 400
  ) {
    res.status(400).send({ message: errorCodes400[code] });
  } else if (
    (errorCodes400 === 23503 && err.constraint !== 'comments_username_foreign')
    || err.status === 400) {
    res.status(400).send({ message: errorCodes400[code] });
  } else if (
    (errorCodes400[code] && err.constraint !== undefined) || err.status === 400) {
    res.status(400).send({ message: errorCodes400[code] });
  } else { next(err); }
};


exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: 'page not found' });
  else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ message: 'method not allowed' });
};


exports.handle422 = (err, req, res, next) => {
  console.log(err, '<<< 422');
  const { code } = err;
  const errorCodes422 = {
    23505: 'name already exists',
    23503: 'not found',
    42703: 'invalid input',

  };
  if (errorCodes422[code]) {
    res.status(422).send({ message: errorCodes422[code] });
  } else next(err);
};
exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ message: 'internal server error' });
};
