exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: 'page not found' });
  else next(err);
  // other codes
  // err is what we made in the promise reject message so can ref it here
  // check if 404 and if not then pass to next err
};


exports.handle400 = (err, req, res, next) => {
  const { code } = err;
  const errorCodes400 = {
    '22P02': 'invalid input syntax for integer',
  };
  if (errorCodes400[code]) res.status(400).send({ message: errorCodes400[code] });
  else next(err);
};


// exports.handle422 = (err, req, res, next) => {
//   res.status(422).send({});
// };
exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'internal server error' });
};
