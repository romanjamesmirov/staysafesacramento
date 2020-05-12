const router = require('express').Router();

router.post('/register', require('./register'))
	.post('/login', require('./login'))
	.get('/users', require('./users'))
	.get('/user/:username', require('./user'))
	.get('/chat/:username', require('../auth/token'), require('./chat'));
module.exports = router;