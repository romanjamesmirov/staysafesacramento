// Handshake will occur when website first loads. Either the user is authorized to load and post to chatrooms or is not. Login/register causes disconnect and reconnect with handshake query that contains a token.
const jwt = require('jsonwebtoken');
module.exports = (socket, next) => {
	const { query } = socket.handshake;
	if (!query || !query.token) return next(new Error('Socket authorization error'));
	try {
		const { _id, username } = jwt.verify(query.token, process.env.TOKEN_SECRET);
		socket.user = { _id, username, chats: {}, connections: query.connections };
	} catch (err) { return next(new Error('Socket authorization error')); }
	next();
};

// RESOURCES
// #R1 – docs.mongodb.com/manual/reference/operator/query/all/#op._S_all
// #R2 – try-catch jwt.verify syntax – npmjs.com/package/jsonwebtoken