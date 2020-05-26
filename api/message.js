const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async ({ user, params, body}, res) => {
	const when = new Date(); // capture time ASAP
	user = await User.findById(user._id);
	const contact = await User.findOne({ username: params.to });
	const contact_id = contact._id.valueOf();
	const chat = await Chat.findOne( // find chat using _id values
		{ users: { $all: [user._id, contact_id] } });
	const from = chat.users[0] === user._id ? 0 : 1; 
	const msgObj = { from, when, text: body }; 
	const pastMessages = [...chat.pastMessages, msgObj];
	chat.pastMessages = pastMessages; // format message object and save it
	try { await chat.save(); } catch (e) { return res.status(500).send('Failed to save new message'); }
	res.send('Message saved');
}