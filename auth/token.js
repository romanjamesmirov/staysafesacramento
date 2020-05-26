// If you want to protect a route – to make it private – add this middleware to check if the user is authorized. 
const { verify } = require('jsonwebtoken');
module.exports = (req, res, next) => {
	// Unauthorized if without `Authorization: Bearer ${token}`.
	const token = req.header('Authorization');
	if (!token) return res.status(401).send('You must log in to do that');
	try { // JWT validates? 
		const { _id } = verify(token.slice(7), process.env.TOKEN_SECRET);
		req.user = { _id }; // add contained (encrypted _id) to req obj
		next();
		// Unauthorized if with authorization header but it fails. 
	} catch (error) { res.status(401).send('You must log in to do that'); }
};