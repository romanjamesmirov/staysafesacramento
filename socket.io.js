const Chat = require('./models/Chat');
const User = require('./models/User');
const server = require('./server');
const io = require('socket.io').listen(server);
io.use(require('./auth/handshake')); // attach user data to socket

const loadChat = (_id, name, contacts) => async to => {
	const recipient = await User.findOne({ username: to });
	const chat = await Chat.findOne({ users: { $all: [_id, recipient._id] } });
	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i]._id.toString() !== recipient._id.toString()) continue;
		contacts[i].name = recipient.name;
		contacts[i].username = to;
		contacts[i].chat = chat;
		contacts[i].chatUserNumber = _id.toString() === chat.users[0]._id.toString() ? 1 : 0;
		break;
	}
	socket.emit('chat loaded', {
		pastMessages: chat.pastMessages,
		contactIsChatUserNumber: contacts[i].chatUserNumber
	});
}

const sendMessage = (from, contacts, _id, socket) => async ({ to, text }) => {
	const when = new Date();
	const contactIndex = (function () {
		for (let i = 0; i < contacts.length; i++) {
			if (contacts[i].username === to) return i;
		}
	}());
	const contact = contacts[contactIndex];
	const { chat, chatUserNumber } = contact;
	const msgObj = { text, when, from };
	if (!!io.sockets.adapter.rooms[to].sockets) {
		io.to[to].emit('receive message', msgObj);
	} // emit to user's room if they're online
	msgObj.from = chatUserNumber === 1 ? 0 : 1;
	const pastMessages = [...chat.pastMessages, msgObj];
	chat.pastMessages = pastMessages;
	try {
		const savedChat = chat.save();
		contacts[contactIndex].chat = savedChat;
	}
	catch (e) { socket.emit('500 error', 'Couldn\'t save chat'); }
}

io.on('connection', socket => {
	const { _id } = socket.user;
	let { name, username, contacts } = User.findOne({ _id });
	contacts = contacts.map(contact => ({ _id: contact._id }));
	socket.join(user.username); // one room per user
	socket.on('load chat', loadChat(_id, name, contacts));
	socket.on('send message', sendMessage(name, contacts, _id, socket));
});

module.exports = io;

// RESOURCES
// #R1 – Check if room is empty – stackoverflow.com/a/25028953