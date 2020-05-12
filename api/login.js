// This route authenticates an existing user. 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginValidation = require('../auth/login');
module.exports = async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Return an error message if the username doesn't exist.
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (!user) return res.status(400).send(`A user with the username ${username} does not exist.`);

	// Return an error message if password is incorrect.
	const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordCorrect) return res.status(400).send('The password is incorrect.');
	const { _id, name, have, need } = user;
	const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET);
	const connections = withoutIds(user.connections);
	res.json({ name, have, need, connections, token });
};

// Don't send Mongo _id's of connections – replace with public user data.
async function withoutIds(users) {
	if (users.length === 0) return [];
	const slice = replaceIds(users.slice(0, -1));
	const { user_id, hasUnread } = users[users.length - 1];
	const user = await User.findOne({ _id: user_id });
	if (!user) return slice;
	const { name, username, need, have } = user;
	return slice.concat({ name, username, need, have, hasUnread });
}

// QUESTIONS
// #Q1 – I have a question about login user data validation. WHY LOGIN VALIDATION? JUST RETURN ERRORS IF THE USERNAME OR PASS IS INCORRECT.