const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

/* 
										REGISTRATION
*/

router.post('/register', async (req, res) => {
	// Validate the data before doing anything else to make sure it will pass requirements of User properties. 
	const { error } = registerValidation(req.body); //*
	if (error) return res.status(400).send(error.details[0].message);

	const { name, username, password, have, need } = req.body;

	// Return an error message if the username is taken.
	const userExists = await User.findOne({ username });
	if (userExists) return res.status(400).send(`The username ${username} is already being used.`);

	const hashedPassword = await bcrypt.hash(password, 10); // Can only decrypt if you have original password. 

	const user = new User({ name, username, password: hashedPassword, have, need });
	try {
		const savedUser = await user.save();
		const token = jwt.sign({ name, username }, process.env.TOKEN_SECRET);
		res.json({ token }); //%
	} catch (error) { res.status(400).send(error); }
});

/*
												LOGIN
*/

router.post('/login', async (req, res) => {
	// Not sure why we need to tell the user why their username or PW is invalid (since this isn't /register) but we'll tell them. 
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { username, password } = req.body;

	// Return an error message if the username doesn't exist.
	const user = await User.findOne({ username });
	if (!user) return res.status(400).send(`A user with the username ${username} does not exist.`);

	// Return an error message if the user exists but the password is incorrect.
	const passwordCorrect = await bcrypt.compare(password, user.password);
	if (!passwordCorrect) return res.status(400).send('The password is incorrect.');

	// Create, assign, and send the JSON web token. 
	const token = jwt.sign({ name: user.name, username }, process.env.TOKEN_SECRET);
	res.json({ name: user.name, have: user.have, need: user.need, token });
});

module.exports = router;

/**
 * %
 * https://stackoverflow.com/a/43492093
 *
 * *
 * Update to include supplies? i.e. You must need and/or have at least one thing
 *
 */