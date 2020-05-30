const User = require('../models/User');

module.exports = async ({ query }, res) => {
	if (!query.usernames && !query.ids) { // nobody specific? 
		const users = await User.find({}); // then return everyone.
		for (let i = 0; i < users.length; i++) {
			const { name, username, need, have } = users[i];
			users[i] = { name, username, need, have }; // no private info
		}
		return res.json(users);
	} else if (!!query.usernames) {
		const users = query.usernames.split(','); // someone(s) specific? 
		for (let i = 0; i < users.length; i++) {
			const user = await User.findOne({ username: users[i] });
			if (!user) { users.splice(i, 1); continue; } // doesn't exist?
			const { name, username, need, have } = user;
			users[i] = { name, username, need, have }; // no private info
		}
		res.json(!users[1] ? users[0] : users); // people or person? 
	} else if (!!query.ids) { // same as above, but using id's
		const users = query.ids.split(','); 
		for (let i = 0; i < users.length; i++) {
			const user = await User.findOne({ _id: users[i] });
			if (!user) { users.splice(i, 1); continue; }
			const { name, username, need, have } = user;
			users[i] = { name, username, need, have };
		}
		res.json(!users[1] ? users[0] : users);
	}
};