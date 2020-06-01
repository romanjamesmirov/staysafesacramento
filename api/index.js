const router = require('express').Router();
const tokenAuth = require('../auth/token');

router.post('/register', require('./register'))
	.post('/login', require('./login'))
	.delete('/users/delete', tokenAuth, require('./delete'))
	.get('/users', require('./users'))
	.get('/chat/:contact_id', tokenAuth, require('./chat'))
	.post('/message', tokenAuth, require('./message'));

module.exports = router;