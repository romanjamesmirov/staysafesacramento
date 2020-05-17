// Handshake occurs when website first loads. Either user is or isn't authorized to load and post to chats. Login/register causes disconnect + reconnect with new handshake query containing token
module.exports = (socket, next) => {
	const { query } = socket.handshake;
	const error = new Error('Socket authorization error');
	if (!query || !query.token) return next(error);
	try {
		const jwt = require('jsonwebtoken');
		const { _id } = jwt.verify(query.token, process.env.TOKEN_SECRET);
		socket.user = { _id };
		next();
	} catch (e) { next(error) }
};

// RESOURCES
// #R1 – docs.mongodb.com/manual/reference/operator/query/all/#op._S_all
// #R2 – try-catch jwt.verify syntax – npmjs.com/package/jsonwebtoken