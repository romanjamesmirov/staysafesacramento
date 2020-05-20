const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async (req, res) => {
	const contact = await User.findOne({ username: req.params.username });
	const isNotFirstLoad = req.query.hasOwnProperty('isNotFirstLoad');
	if (isNotFirstLoad && !contact.hasUnread) // no new messages since session?
		return res.status(204).send('No new messages'); // if so, return
	
	const user_id = ObjectId(req.user._id);
	const user = await User.findOne(user_id);

	const contacts = [...user.contacts]; 
	const contact_id = contact._id.valueOf();
	for (let i = 0; i < contacts.length; i++) {
		if (contact_id !== contacts[i]._id) continue;
		contacts[i].hasUnread = false;
		break;
	}
	user.contacts = contacts; // set the user contact `hasUnread` to false
	try { await user.save(); }
	catch (e) { return res.status(500).send('Failed to update contacts'); }

	const chat = await Chat.findOne(
		{ users: { $all: [req.user._id, contact_id] } });
	const users = chat.users[0] === contact_id
		? [req.params.username, user.username]
		: [user.username, req.params.username];
	res.json({ users, pastMessages: chat.pastMessages }); // return chat
};