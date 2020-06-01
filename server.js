if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const { NODE_ENV, PORT, DB_CONNECT } = process.env;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
require('mongoose').connect(DB_CONNECT, connectOptions); // DB: ✅

const express = require('express'), app = express();
app.use(express.json());
if (NODE_ENV === 'production') {
	const { join } = require('path');
	app.enable('trust proxy');
	app.use(secureRedirect);
	app.get(process.env.ACME_PATH_1, (req, res) => res.send(process.env.ACME_DATA_1));
	app.get(process.env.ACME_PATH_2, (req, res) => res.send(process.env.ACME_DATA_2));
	app.use('/api', require('./api'));
	app.use(express.static(join(__dirname, 'build')));
	app.get('/*', (req, res) => res.sendFile(join(__dirname, 'build',
		'index.html')));
} else app.use('/api', require('./api'));
app.listen(PORT); // Server: ✅

function secureRedirect({ secure, headers, url }, { redirect }, next) {
	if (secure) return next();
	redirect(`https://${headers.host}${url}`);
}