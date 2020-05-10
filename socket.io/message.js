module.exports = (chatroomName, text, socket) => {
	const time = new Date();
	const msg = { sender: socket.sender_id, time, text };
	socket.broadcast.to(chatroomName).emit('user message', msg);
	const chatroom = findBy(socket.chatrooms, { name: chatroomName });
	chatroom.messages = [...chatroom.messages, msg];
	chatroom.save();
};

function findBy(arr, vals) {
	if (arr.length === 0) return null;
	for (let key in Object.keys(vals)) {
		if (vals[key] !== arr[0][key]) return findBy(arr.slice(1), vals);
	}
	return arr[0];
}