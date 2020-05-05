// Fire up the database. 
// Mongo: connect database using URL stored in environment variable. 
if (process.env.NODE_ENV === 'development') require('dotenv').config();
require('mongoose').connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

// Fire up the server. 
// Express: middleware for parsing req (requests from POSTs) and for auth and room routes. 
const express = require('express');
const app = express();
let server; // Declared here so it's visible to socket.io below. 
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chatroom', require('./routes/chatroom'));
app.use('/api/users', require('./routes/users'));
if (process.env.NODE_ENV === 'production') { 
	app.enable('trust proxy');
	app.use((req, res, next) => {
		if (!req.secure) res.redirect(`https://${req.headers.host}${req.url}`);
		else next();
	}); //developer.ibm.com/technologies/node-js/tutorials/make-https-the-defacto-standard
	const path = require('path');
	app.use(express.static(path.join(__dirname, 'build')));
	app.get('/*', (req, res) =>
		res.sendFile(path.join(__dirname, 'build', 'index.html'))
	); //create-react-app.dev/docs/deployment
	const fs = require('fs');
	const PORT = process.env.PORT || 5000;
	server = require('https').createServer({
		key: fs.readFileSync(path.resolve('cert/server.key')),
		cert: fs.readFileSync(path.resolve('cert/server.crt'))
	}, app)
		.listen(PORT);
} 
// Use socket.io without importing http – stackoverflow.com/a/49833178
// Nevermind the above. Now I want to use https in development – github.com/dakshshah96/local-cert-generator

// Fire up the real time chat. 
// Socket.io: listen for connections from clients to the server. 
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

// FURTHER RESOURCES
// 1. create-react-app.dev/docs/using-https-in-development
// 2. socket.io/docs/#Using-with-Express (uses http.Server)
// 3. stackoverflow.com/q/13857747 (Server vs createServer)