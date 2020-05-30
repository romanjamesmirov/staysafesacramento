const User = require('../models/User');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const registerValidation = require('../auth/register');

module.exports = async (req, res) => { // authenticate and return new user
	// verify that user data conforms to User fields
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	
	const { name, username, password, have, need } = req.body;
	const userExists = await User.findOne({ username });
	if (userExists) return res.status(400).send(`The username ${username} is already being used.`); // return an error message if username taken
	
	const hashedPassword = await hash(password, 10); // *
	const user = new User({ name, username, hashedPassword, have, need });
	try {
		const { _id } = await user.save();
		const token = sign({ _id: _id.valueOf() }, process.env.TOKEN_SECRET);
		res.json({ token });
	} catch (error) { res.status(400).send(error); }
};

// * You can decrypt hashed password only if you supply correct original password to bcrypt.compare()