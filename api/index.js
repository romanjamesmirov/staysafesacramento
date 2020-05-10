const router = require('express').Router();

router.post('/register', require('./register'))
	.post('/login', require('./login'))
	.get('/users', require('./users'))
	.get('/users/:username', require('./user'));
module.exports = router;