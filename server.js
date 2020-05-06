// Fire up the database. 
// Mongo: connect database using URL stored in environment variable. 
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
require('mongoose').connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

// Fire up the server. 
// Express: middleware for parsing req (requests from POSTs) and for auth and room routes. 
const express = require('express');
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'production') {
	app.enable('trust proxy')
		.use((req, res, next) => {
			if (req.secure) next();
			else res.redirect(`https://${req.headers.host}${req.url}`);
		}); //developer.ibm.com/technologies/node-js/tutorials/make-https-the-defacto-standard
	useAPI(app);
	const path = require('path');
	app.use(express.static(path.join(__dirname, 'build')))
		.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build',
			'index.html'))); //create-react-app.dev/docs/deployment
} else useAPI();

function useAPI() {
	app.use('/api/auth', require('./routes/auth'))
		.use('/api/chatroom', require('./routes/chatroom'))
		.use('/api/users', require('./routes/users'));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

require('./socket.io.js')(server); // Fire up the real time chat. 

// FURTHER RESOURCES
// Using http.Server – socket.io/docs/#Using-with-Express
// Server vs createServer() – stackoverflow.com/q/13857747
// Use socket.io without importing http – stackoverflow.com/a/49833178

// DON'T DO
// create-react-app.dev/docs/using-https-in-development
// Use https in development – github.com/dakshshah96/local-cert-generator