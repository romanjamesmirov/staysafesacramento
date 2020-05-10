const io = require('socket.io');
module.exports = server => io
	.listen(server)
	.use(require('../auth/handshake'))
	.on('connection', socket => socket
		.on('subscribe', recipientUsername =>
			require('./subscribe')(recipientUsername, socket))
		.on('user message', (chatroomName, msg) =>
			require('./message')(chatroomName, msg, socket))
	);