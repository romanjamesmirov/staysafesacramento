// This route authenticates a new user. 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerValidation = require('../auth/register');
module.exports = async (req, res) => {

	// Validate user data to make sure it will pass User field requirements.
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Return an error message if the username is taken.
	const { name, username, password, have, need } = req.body;
	const userExists = await User.findOne({ username });
	if (userExists) return res.status(400).send(`The username ${username} is already being used.`);

	// Can only decrypt if you have original password. 
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new User({ name, username, hashedPassword, have, need });
	try {
		const savedUser = await user.save();
		const { _id } = savedUser;

		// Create, assign, and send the JSON web token. #R1
		const token = jwt.sign({ _id }, process.env.TOKEN_SECRET);
		res.json({ token });
	} catch (error) { res.status(400).send(error); }
};

// QUESTIONS
// #Q1 – Update registration user data validation to include supplies? e.g. You must have and/or need something to register.

// RESOURCES
// #R1 – In requests and responses, where do you put the token? – https://stackoverflow.com/a/43492093