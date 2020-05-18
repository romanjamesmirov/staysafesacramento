const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async (req, res) => {
	const when = new Date(); // capture time asap
	const user = await User.findOne(ObjectId(req.user._id));
	const contact = await User.findOne({ username: req.params.username });
	const contact_id = contact._id.valueOf();
	const chat = await Chat.findOne( // find chat using _id values
		{ users: { $all: [req.user._id, contact_id] } });
	const usersIndex = chat.users[0] === req.user._id ? 0 : 1;
	const msgObj = { from: usersIndex, when, text: req.body }; 
	const pastMessages = [...chat.pastMessages, msgObj];
	chat.pastMessages = pastMessages; // format message object and save it
	try { await chat.save(); } catch (e) { return res.status(500).send('Failed to save new message'); }
	res.send('Message saved');
}