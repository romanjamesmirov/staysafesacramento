const router = require('express').Router();
const tokenAuth = require('../auth/token');

router.post('/register', require('./register'))
	.post('/login', require('./login'))
	.get('/users', require('./users'))
	.get('/chat/:username', tokenAuth, require('./chat'))
	.post('/message/:username', tokenAuth, require('./message'));

module.exports = router;