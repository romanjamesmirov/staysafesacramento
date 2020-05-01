const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Chat = require('../models/Chat');
const User = require('../models/User');

/*
						CLICKING ON A PERSON TO CHAT WITH THEM
*/

router.get('/:username', verifyToken, async (req, res) => {
	// Return a 404 if no user has the username in the URL parameter. 
	const recipient = await User.findOne({ username: req.params.username });
	if (!recipient) return res.status(400).send(`A user with the username ${req.params.username} does not exist.`);

	// Have these people DM'ed each other before? 
	const room = await Room.findOne(
		{ people: { $all: [req.user.username, req.params.username] } }
	); // https://docs.mongodb.com/manual/reference/operator/query/all/#op._S_all

	// If they haven't, create a new chatroom for them and send its metadata. 
	if (!room) {
		const response = await newRoom(req.user.username, req.params.username, res);
		return response;
	}

	// If they have, send the data of the existing chatroom.  
	res.json({ people: room.people, messages: room.messages });
});

module.exports = router;

async function newRoom(sender, recipient, res) {
	const newRoomDraft = new Room({
		people: [sender, recipient],
		messages: []
	});
	try {
		const newRoom = await newRoomDraft.save();
		return res.json({ people: newRoom.people, messages: newRoom.messages });
	} catch (error) {
		return res.status(400).send(error); // Isn't this a 500 error? If it is, should we be sending 500 error details to the client? 
	}
}