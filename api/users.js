const User = require('../models/User');

module.exports = async (req, res) => {
	const usersUnsafe = (function (usernames) {
		switch (typeof usernames) {
			case "undefined": const users = await User.find({});
				return users;
			case "string":
				const user = await User.findOne({ username: usernames });
				return user;
			default:
				const users = usernames.map(username => {
					const user = await User.findOne({ username });
					return user;
				});
				return users;
		}
	}(req.params.usernames));

	const usersSafe = usersUnsafe.map(user => {
		const { name, username, need, have } = user;
		return { name, username, need, have };
	});
	
	res.json(allUsersSafe);
};