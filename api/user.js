const User = require('../models/User');
module.exports = async (req, res) => {
	const { username } = req.params;
	const userUnsafe = await User.findOne({ username });
	if (userUnsafe === null) return res.status(404).send(`A user with the username of ${username} was not found.`);
	const { name, have, need } = userUnsafe;
	res.json({ name, have, need });
};