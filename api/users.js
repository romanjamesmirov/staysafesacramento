const User = require('../models/User');

module.exports = async ({ query }, res) => {
	let users = [];
	if (query.usernames === undefined && query.ids === undefined) { 
		users = await User.find({}); // nobody specific, return everyone
		for (let i = 0; i < users.length; i++) {
			const { _id, name, username, need, have } = users[i];
			users[i] = { _id: _id.valueOf(), name, username, need, have }; 
		}
	} else if (!query.ids) {
		const usernames = query.usernames.split(','); // someone(s) specific? 
		for (let i = 0; i < usernames.length; i++) {
			const user = await User.findOne({ username: usernames[i] });
			if (!user) continue; // doesn't exist?
			const { _id, name, need, have } = user;
			users[i] = { _id: _id.valueOf(), name, username: usernames[i], need, have }; 
		}
	} else if (!query.usernames) { // same as above, but using id's
		const user_ids = query.ids.split(','); 
		for (let i = 0; i < user_ids.length; i++) {
			const user = await User.findById(user_ids[i]);
			if (!user) continue;
			const { name, username, need, have } = user;
			users[i] = { _id: user_ids[i], name, username, need, have };
		}
	}
	res.json(users);
};