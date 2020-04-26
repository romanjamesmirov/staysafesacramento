const jwt = require('jsonwebtoken');

// Middleware function you can add to any route you want to be protected (private), or accessible only to users who have logged in and thus have a verifiable token. 
module.exports = function (req, res, next) {
	// Forbidden if request is without the auth-token header.
	const token = req.header('auth-token');
	if (!token) return res.status(401).send('Access denied.');

	// Handle case where token is valid and case where it is invalid.
	try {
		const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verifiedUser;
		next();
	} catch (error) {
		// Why not return it? https://stackoverflow.com/questions/52919585/node-js-return-res-status-vs-res-status
		res.status(400).send('Invalid token');
	}
}