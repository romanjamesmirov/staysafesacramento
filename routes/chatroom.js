const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Chatroom = require('../models/Chatroom');
const User = require('../models/User');

router.get('/:username', verifyToken, async (req, res) => {
	const { username } = req.params;
	const recipient = await User.findOne({ username });

	if (!recipient) return res.status(404).send(`A user with the username ${username} does not exist.`); // 404 if :username is invalid.

	const sender = await User.findOne({ username: req.user.username });
	const existingChatroom = await Chatroom.findOne({
		users: { $all: [sender._id, recipient._id] } //R1
	}); 
	if (!existingChatroom) { 
		const newChatroomDraft = new Chatroom({
			users: [sender._id, recipient._id]
		});
		try { 
			const newRoom = await newRoomDraft.save();
			return res.json({ id: newRoom.id }); // 200 with new chatroom.
		} catch (error) {
			return res.status(400).send(error); //Q1
		}

	} else {
		const { id } = existingChatroom;
		const _idToUsernameMap = {
			[sender._id.toString()]: sender.username,
			[recipient._id.toString()]: username
		}; // 1. 
		const messages = replaceIds(existingChatroom.messages, _idToUsernameMap);
		return res.json({ id, messages }); // 200 with existing chatroom.
	}
});

module.exports = router;

function replaceIds(messages, idMap) {
	if (messages.length === 1) {
		const msg = messages[0];
		return [{ ...msg, sender: idMap[msg.sender] }];
	} else {
		const slice = replaceIds(messages.slice(0, messages.length - 1), idMap);
		const msg = messages[messages.length - 1];
		return slice.concat({ ...msg, sender: idMap[msg.sender.toString()] });
	} 
}

// POINTS
// 1. Don't send MongoDB _id's of chatroom users but their usernames.

// QUESTIONS
// Q1. Isn't this a 500 error? If it is, should we be sending 500 error details to the client? 

// RESOURCES
// R1. docs.mongodb.com/manual/reference/operator/query/all/#op._S_all