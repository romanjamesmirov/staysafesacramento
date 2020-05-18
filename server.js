if (process.env.NODE_ENV !== 'production') require('dotenv').config();
require('mongoose').connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }); // DB: ✅

const express = require('express'), app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'production') {
	const path = require('path');
	app.enable('trust proxy')
		.use(function (req, res, next) {
			if (req.secure) return next();
			res.redirect(`https://${req.headers.host}${req.url}`);
		})
		.use('/api', require('./api'))
		.use(express.static(path.join(__dirname, 'build')))
		.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build',
			'index.html')));
} else app.use('/api', require('./api'));
app.listen(process.env.PORT); // Server: ✅