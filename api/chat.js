const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async (req, res) => { // GET chat users & allMessages
	const contact = await User.findOne({ username: req.params.username });
	const isNotFirstLoad = req.query.hasOwnProperty('isNotFirstLoad');
	if (isNotFirstLoad && !contact.hasUnread) // is session up to date?
		return res.status(204).send('No new messages'); // if so, return
	
	const user = await User.findById(req.user_id); // if not...
	const contacts = [...user.contacts]; 
	const contact_id = contact._id.valueOf();
	for (let i = 0; i < contacts.length; i++) { // ... find contact
		if (contact_id !== contacts[i]._id) continue;
		contacts[i].hasUnread = false; // ... and remove badge notif
		break;
	}
	user.contacts = contacts; 
	try { await user.save(); }
	catch (e) { return res.status(500).send('Failed to update contacts'); }

	const chat = await Chat.findOne(
		{ users: { $all: [req.user_id, contact_id] } }); 
	if (!chat) return res.status(404).send('These people haven\'t talked before');
	const { users, allMessages } = chat;
	res.json({ users, allMessages });
};