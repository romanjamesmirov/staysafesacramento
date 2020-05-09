const io = require('socket.io');
const jwt = require('jsonwebtoken');
const Chatroom = require('./models/Chatroom');
const User = require('./models/User');
module.exports = server => io
	.listen(server)
	.use(onHandshake)
	.on('connection', socket => socket
		.on('open chatroom',
			recipientUsername => onOpenChatroom(recipientUsername, socket))
		.on('user message',
			(chatroomName, msg) => onUserMessage(chatroomName, msg, socket))
	);


// Handshake will occur when website first loads. Either the user is authorized to load and post to chatrooms or is not. Login/register causes disconnect and reconnect with handshake query that contains a token. 
function onHandshake(socket, next) {
	socket.unauthorized = true;
	if (!socket.handshake.query || !socket.handshake.query.token) return next();
	try {
		const decoded = jwt.verify(socket.handshake.query.token,
			process.env.TOKEN_SECRET);
		socket.sender_id = decoded._id;
		socket.senderUsername = decoded.username;
		socket.unauthorized = false;
		socket.chatrooms = [];
	} catch (err) { }
	next();
}

async function onOpenChatroom(recipientUsername, socket) {
	// Return a 401 or 404 if user isn't logged in or recipientUsername is invalid, respectively. 
	if (socket.unauthorized) return socket.emit('error', 401);
	const recipient = await User.findOne({ username: recipientUsername });
	if (!recipient) return socket.emit('error', 404);

	// Get chatroom and join it. 
	const chatroom = await existingOrNewChatroom(socket.sender_id, recipient._id);
	if (!chatroom) return socket.emit('error', 'Could not create new chat.');
	const idToUsernameMap = {
		[socket.sender_id.toString()]: socket.senderUsername,
		[recipient._id.toString()]: recipientUsername
	};
	socket.join(chatroom.name);

	// Send chatroom history and socket.io name to client for further reference. 
	socket.emit('chatroom opened', {
		chatroomName: chatroom.name,
		messages: replaceIds(existingChatroom.messages, idToUsernameMap),
	});
	socket.chatrooms.push(chatroom);
}

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

function onUserMessage(chatroomName, text, socket) {
	const time = new Date();
	const msg = { sender: socket.sender_id, time, text };
	socket.broadcast.to(chatroomName).emit('user message', msg);
	const chatroom = findBy(socket.chatrooms, { name: chatroomName });
	chatroom.messages = [...chatroom.messages, msg];
	chatroom.save();
}

function findBy(arr, vals) {
	if (arr.length === 0) return null; 
	for (let key in Object.keys(vals)) {
		if (vals[key] !== arr[0][key]) return findBy(arr.slice(1), vals);
	} 
	return arr[0]; 
}

// RESOURCES
// #R1 – docs.mongodb.com/manual/reference/operator/query/all/#op._S_all
// #R2 Handshake authorization – stackoverflow.com/a/36821359
// #R3 try-catch jwt.verify syntax – npmjs.com/package/jsonwebtoken