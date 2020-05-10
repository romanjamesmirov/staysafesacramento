const User = require('../models/User');
module.exports = async (req, res) => {

	// Get a list of all users. 
	const allUsersUnsafe = await User.find({});

	// Don't send passwords. 
	const allUsersSafe = allUsersUnsafe.map(user => {
		const { name, username, need, have } = user;
		return { name, username, need, have };
	});
	res.json(allUsersSafe);
};