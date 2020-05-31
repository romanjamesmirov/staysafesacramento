const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async ({ query, user_id }, res) => {
	const user = await User.findByIdAndDelete(user_id);
	if (!user) return res.status(404).send('You don\'t exist, so I couldn\'t delete you...');
	const chats = await Chat.deleteMany({ users: user_id }); // chats.ok === true if succeeded but IDK what to do if it's not ok since the user is already deleted
	res.send('Successfully deleted the profile');
};