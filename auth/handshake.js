// Handshake will occur when website first loads. Either the user is authorized to load and post to chatrooms or is not. Login/register causes disconnect and reconnect with handshake query that contains a token.
const jwt = require('jsonwebtoken');
module.exports = (socket, next) => {
	socket.unauthorized = true;
	if (!socket.handshake.query || !socket.handshake.query.token) return next(new Error('Socket authorization error'));
	try {
		const decoded = jwt.verify(socket.handshake.query.token,
			process.env.TOKEN_SECRET);
		socket.sender_id = decoded._id;
		socket.senderUsername = decoded.username;
		socket.unauthorized = false;
		socket.chatrooms = [];
	} catch (err) { return next(new Error('Socket authorization error')); }
	next();
};

// RESOURCES
// #R1 – docs.mongodb.com/manual/reference/operator/query/all/#op._S_all
// #R2 – try-catch jwt.verify syntax – npmjs.com/package/jsonwebtoken