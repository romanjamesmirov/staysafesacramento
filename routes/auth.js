// These routes authenticate a user. 
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
router.post('/register', async (req, res) => {

	// Validate user data to make sure it will pass User field requirements.
	const { error } = registerValidation(req.body); // 1
	if (error) return res.status(400).send(error.details[0].message);

	// Return an error message if the username is taken.
	const { name, username, password, have, need } = req.body;
	const userExists = await User.findOne({ username });
	if (userExists) return res.status(400).send(`The username ${username} is already being used.`);

	// Can only decrypt if you have original password. 
	const hashedPassword = await bcrypt.hash(password, 10); 
	const user = new User({ name, username, password: hashedPassword, have, need });
	try {
		const savedUser = await user.save();
		const { _id } = savedUser;

		// Create, assign, and send the JSON web token. #R1
		const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET); 
		res.json({ token }); 
	} catch (error) { res.status(400).send(error); }
});

router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body); 
	if (error) return res.status(400).send(error.details[0].message);

	// Return an error message if the username doesn't exist.
	const { username, password } = req.body;
	const user = await User.findOne({ username }); 
	if (!user) return res.status(400).send(`A user with the username ${username} does not exist.`);

	// Return an error message if password is incorrect.
	const passwordCorrect = await bcrypt.compare(password, user.password);
	if (!passwordCorrect) return res.status(400).send('The password is incorrect.');
	const { _id } = user;
	const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET);
	const { name, have, need, connections, updates } = user;
	res.json({ name, have, need, connections, updates, token });
});

module.exports = router;

// QUESTIONS
// #Q1 – Update registration user data validation to include supplies? e.g. You must have and/or need something to register.
// #Q2 – I have a question about login user data validation. WHY LOGIN VALIDATION? JUST RETURN ERRORS IF THE USERNAME OR PASS IS INCORRECT.

// RESOURCES
// #R1 – In requests and responses, where do you put the token? – https://stackoverflow.com/a/43492093