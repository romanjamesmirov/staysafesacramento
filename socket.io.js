const io = require('socket.io');
const Chat = require('./models/Chat');
const User = require('./models/User');
module.exports = server => io
	.listen(server)
	.use(require('./auth/handshake'))
	.on('connection', socket => {

		// Each person is subbed to their own room. You send messages to someone by emitting to a room that's named after the username of that user.
		socket.join(socket.user.username);
		socket.on('send message', async ({ to, text }) => {
			const when = new Date();

			// If room isn't empty (i.e. if recipient is online -> room exists).
			if (typeof io.sockets.adapter.rooms[to].sockets !== 'undefined') {
				io.to[to].emit('receive message',
					{ text, when, from: socket.user.username });
			}

			const chat = socket.user.chats[to] || (function () {
				const toDocument = await User({ username: to });
				const newChat = new Chat(
					{ users: [socket.user._id, toDocument.username], history: [] });
				return newChat;
			}());
			const msg = {
				text, when,
				from: chat.users[0].toString() === socket.user._id.toString() ? 0 : 1
			}
			chat.history = [...chat.history, msg];
			try {
				await chat.save();
				socket.user.chats[to] = chat;
			} catch (err) { socket.emit('500 error', 'Failed to save chat'); }
		});

		// When a user clicks, for the first time in the current client session, on a chat between them and somebody they talked to before, we want to load the chat so that it can be stored in redux on the client. 
		socket.on('load chat', async to => {
			const toDocument = await User.findOne({ username: to });
			const chat = await Chat.findOne({
				users: { $all: [socket.user._id, toDocument._id] }
			});
			socket.emit('chat loaded', chat.history);
			socket.user.chats[to] = chat;
		});
	});

// RESOURCES
// #R1 – Check if room is empty – stackoverflow.com/a/25028953