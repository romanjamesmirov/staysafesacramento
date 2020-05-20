const User = require('../models/User');

module.exports = async (req, res) => {
	const usersUnsafe = (function (usernames) {
		const users = !usernames ? await User.find({})
			: usernames.split(',').map(username => {
				const user = await User.findOne({ username });
				return user;
			});
		return users.length > 1 ? users : users[0];
	}(req.query.usernames));

	const usersSafe = usersUnsafe.map(user => {
		const { name, username, need, have } = user;
		return { name, username, need, have };
	});

	res.json(usersSafe);
};