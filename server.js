// Fire up the database. 
// Mongo: connect database using URL stored in environment variable. 
require('dotenv').config();
require('mongoose').connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

// Fire up the server. 
// Express: middleware for parsing req (requests from POSTs) and for auth and room routes. 
const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const roomsRoute = require('./routes/rooms');
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/rooms', roomsRoute);
const server = app.listen(5000); // stackoverflow.com/a/49833178

// Fire up the real time chat. 
// Socket.io: listen for connections from clients to the server. 
const io = require('socket.io')(server);
io.on('connection', socket => {
	console.log('User connected.');
	socket.on('DM', message => io.emit('DM', message));
	socket.on('disconnect', () => {
		console.log('User disconnected.');
	});
});