const jwt = require('jsonwebtoken');

// Middleware function you can add to any route you want to be protected (private), or accessible only to users who have logged in and thus have a verifiable token. 
function verifyToken(req, res, next) {
	// Forbidden if request is without the "Authorization: Bearer [token]" header.
	const token = req.header('Authorization');
	if (!token) return res.status(401).send('Access denied.'); //R1

	// Handle case where token is valid and case where it is invalid.
	try {
		const verifiedUser = jwt.verify(token.slice(7), process.env.TOKEN_SECRET);
		req.user = verifiedUser;
		next();
	} catch (error) {
		res.status(403).send('Invalid token'); //R2
	}
}

module.exports = verifyToken;

// RESOURCES
// R1. webmasters.stackexchange.com/a/90656
// R2. Why not return res? stackoverflow.com/q/52919585