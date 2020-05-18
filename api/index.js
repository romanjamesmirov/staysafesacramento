const router = require('express').Router();
const tokenAuth = require('../auth/token');

router.post('/register', require('./register'))
	.post('/login', require('./login'))
	.get('/users', require('./users')) // all, set, or single one
	.get('/chat/:username', tokenAuth, require('./chat'))
	.post('/chat/:username', tokenAuth, require('./message'));

module.exports = router;