const User = require('../models/User');
const Chat = require('../models/Chat');

module.exports = async ({ user_id, body}, res) => {
	const when = new Date(); // capture time ASAP

	user = await User.findById(user_id);
	const contact = await User.findById(body.contact_id);

	let chat = await Chat.findOne(
		{ users: { $all: [user_id, body.contact_id] } });
	if (!chat) chat = new Chat({ users: [user_id, body.contact_id] });

	const from = chat.users[0] === user_id ? 0 : 1; 
	chat.allMessages.push({ from, when, text: body.msg }); // formatted msg

	try {
		await chat.save();
		if (chat.allMessages.length === 1) { // new chat
			contact.contacts.push({ contact_id: user_id, hasUnread: true });
			user.contacts.push({ contact_id: body.contact_id, hasUnread: false });
			await contact.save();
			await user.save();
		} else {
			for (let i = 0; i < contact.contacts.length; i++) {
				if (contact.contacts[i].contact_id !== user_id) continue;
				if (!contact.contacts[i].hasUnread) contact.contacts[i].hasUnread = true;
				await contact.save();
				break;
			}
		}
	} catch (e) { return res.status(500).send('Could not send message'); }
	res.send('Message sent');
}