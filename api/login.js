const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginValidation = require('../auth/login');

module.exports = async (req, res) => { // authenticate and return existing user
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { username, password } = req.body; 
	const user = await User.findOne({ username });
	if (!user) return res.status(400).send(`A user with the username ${username} does not exist.`); // return with error if user with username not found

	// Return an error message if password is incorrect.
	const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordCorrect) return res.status(400).send('The password is incorrect.'); // return with error if password doesn't match that of user with username

	const { name, have, need, contacts } = user;
	const token = jwt.sign({ _id: user._id.valueOf() }, process.env.TOKEN_SECRET);
	res.json({ token, name, have, need, contacts });
};

// QUESTIONS
// #Q1 – I have a question about login user data validation. WHY LOGIN VALIDATION? JUST RETURN ERRORS IF THE USERNAME OR PASS IS INCORRECT.