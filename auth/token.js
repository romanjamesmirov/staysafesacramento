// If you want to protect a route, or make it private, add this middleware function to check if the user is authorized. 
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {

	// Unauthorized if request is without `Authorization: Bearer ${token}` header.
	const token = req.header('Authorization');
	if (!token) return res.status(401).send('You must log in to do that');

	// If the JWT validates, we add the contained encrypted _id to req object.
	try {
		const { _id } = jwt.verify(token.slice(7), process.env.TOKEN_SECRET);
		req.user = { _id };
		next();

		// Unauthorized if authorization header present but fails. #R3
	} catch (error) {
		res.status(401).send('You must log in to do that');
	}
};

// RESOURCES
// #R1 401 Unauthorized vs 403 Forbidden – stackoverflow.com/a/3297081
// #R2 Confirmation of #R1 – webmasters.stackexchange.com/a/90656
// #R3 Why not *return* res – stackoverflow.com/q/52919585