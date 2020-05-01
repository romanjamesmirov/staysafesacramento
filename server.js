// Fire up the database. 
// Mongo: connect database using URL stored in environment variable. 
require('dotenv').config();
require('mongoose').connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

// Fire up the server. 
// Express: middleware for parsing req (requests from POSTs) and for auth and room routes. 
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
app.use(express.json());
app.use(require('cors')({ origin: 'https://localhost:3000', optionsSuccessStatus: 200 }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/users', require('./routes/users'));
https.createServer({
	key: fs.readFileSync(path.resolve('cert/server.key')),
	cert: fs.readFileSync(path.resolve('cert/server.crt'))
}, app)
	.listen(5000);
// Use socket.io without importing http – stackoverflow.com/a/49833178
// Nevermind the above. Now I want to use https in development – github.com/dakshshah96/local-cert-generator

// Fire up the real time chat. 
// Socket.io: listen for connections from clients to the server. 
const io = require('socket.io')(https);
io.on('connection', socket => {
	console.log('User connected.');
	socket.on('DM', message => io.emit('DM', message));
	socket.on('disconnect', () => {
		console.log('User disconnected.');
	});
});

// FURTHER RESOURCES
// 1. create-react-app.dev/docs/using-https-in-development
// 2. socket.io/docs/#Using-with-Express (uses http.Server)
// 3. stackoverflow.com/questions/13857747 (Server vs createServer)