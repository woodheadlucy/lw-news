const router = require('express').Router();

const { getUsers, insertNewUser } = require('../controllers/user-controller');

router.route('/').get(getUsers).post(insertNewUser);


module.exports = router;
