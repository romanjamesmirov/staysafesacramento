const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async (req, res) => { // returns chat users & allMessages
	const user = await User.findById(req.user_id);
	let contactsIndex;
	for (let i = 0; i < user.contacts.length; i++) {
		if (user.contacts[i].contact_id === req.params.contact_id) {
			contactsIndex = i; break;
		}
	}

	const justCheckForUnreads = req.query.hasOwnProperty('justCheckForUnreads');
	if (justCheckForUnreads && !user.contacts[contactsIndex].hasUnread)
		return res.status(304).send('No new messages'); // chat Not Modified

	user.contacts[contactsIndex].hasUnread = false;
	try { await user.save(); }
	catch (e) { return res.status(500).send('Failed to update contacts array'); }

	const contact = await User.findById(req.params.contact_id);
	const chat = await Chat.findOne(
		{ users: { $all: [req.user_id, req.params.contact_id] } });
	if (!chat) return res.status(404).send('These people haven\'t talked before');
	const { users, allMessages } = chat;
	res.json({ users, allMessages });
};