// If you want to protect a route, or make it private, add this middleware function to check if the user is authorized. 
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {

	// Unauthorized if request is without `Authorization: Bearer ${token}` header.
	const token = req.header('Authorization');
	if (!token) return res.status(401).send('Access denied.');

	// If the JWT validates, we add the contained encrypted _id to req object.
	try {
		const decoded = jwt.verify(token.slice(7), process.env.TOKEN_SECRET);
		req.sender_id = decoded._id;
		next();

		// Unauthorized if authorization header present but fails. #R3
	} catch (error) {
		res.status(403).send('Invalid token');
	}
};

// RESOURCES
// #R1 401 Unauthorized vs 403 Forbidden – stackoverflow.com/a/3297081
// #R2 Confirmation of #R1 – webmasters.stackexchange.com/a/90656
// #R3 Why not *return* res – stackoverflow.com/q/52919585