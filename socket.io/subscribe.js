const Chatroom = require('../models/Chatroom');
const User = require('../models/User');

module.exports = (recipientUsername, socket) => {
	// Return a 401 or 404 if user isn't logged in or recipientUsername is invalid, respectively. 
	if (socket.unauthorized) return socket.emit('error', 401);
	const recipient = await User.findOne({ username: recipientUsername });
	if (!recipient) return socket.emit('error', 404);

	// Get chatroom and join it. 
	const chatroom = await existingOrNewChatroom(socket.sender_id, recipient._id);
	if (!chatroom) return socket.emit('error', 'Could not create new chat.');
	socket.join(chatroom.name);

	// Send chatroom history and socket.io name to client for further reference. 
	const idToUsernameMap = {
		[socket.sender_id.toString()]: socket.senderUsername,
		[recipient._id.toString()]: recipientUsername
	};
	socket.emit('chatroom opened', {
		chatroomName: chatroom.name,
		messages: replaceIds(existingChatroom.messages, idToUsernameMap),
	});
	socket.chatrooms.push(chatroom);
};

async function existingOrNewChatroom(_id1, _id2) {
	// Either return an existing chatroom...
	const existingChatroom = await Chatroom.findOne({
		users: { $all: [_id1, _id2] } //#R1
	});

	// Or, if it doesn't exist, create one between the two users. 
	if (!existingChatroom) {
		const newChatroomDraft = new Chatroom({ users: [_id1, _id2] });
		try {
			const newChatroom = await newChatroomDraft.save();
			return newChatroom;
		} catch (err) { return null; }
	} else return existingChatroom;
}

// Don't send Mongo _id's of chatroom users – replace with usernames.
function replaceIds(messages, idMap) {
	if (messages.length === 0) return [];
	const slice = replaceIds(messages.slice(0, messages.length - 1), idMap);
	const msg = messages[messages.length - 1];
	return slice.concat({ ...msg, sender: idMap[msg.sender.toString()] });
}

// RESOURCES
// #R1 – Handshake authorization – stackoverflow.com/a/36821359