module.exports = server => {
	const io = require('socket.io').listen(server);
	io.on('connection', socket => {
		console.log('User connected.');
		socket.on('join room', id => {
			console.log('joining room', id);
			socket.join(id);
		});
		socket.on('disconnect', () => {
			console.log('User disconnected.');
		});
	});
}