const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
	const { error } = registerValidation(req.body); // 1
	if (error) return res.status(400).send(error.details[0].message);
	const { name, username, password, have, need } = req.body;
	const userExists = await User.findOne({ username }); // 2
	if (userExists) return res.status(400).send(`The username ${username} is already being used.`);
	const hashedPassword = await bcrypt.hash(password, 10); // 3
	const user = new User({ name, username, password: hashedPassword, have, need });
	try {
		const savedUser = await user.save();
		const token = jwt.sign({ username }, process.env.TOKEN_SECRET); // 4
		res.json({ token }); //R1
	} catch (error) { res.status(400).send(error); }
});

router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body); // 1
	if (error) return res.status(400).send(error.details[0].message);
	const { username, password } = req.body;
	const user = await User.findOne({ username }); // 2
	if (!user) return res.status(400).send(`A user with the username ${username} does not exist.`);
	const passwordCorrect = await bcrypt.compare(password, user.password); // 3
	if (!passwordCorrect) return res.status(400).send('The password is incorrect.');
	const token = jwt.sign({ username }, process.env.TOKEN_SECRET); 
	const { name, have, need, connections, updates } = user;
	res.json({ name, have, need, connections, updates, token });
});

module.exports = router;

// REGISTRATION
// 1. Validate the data before doing anything else to make sure it will pass requirements of User properties. 
// Update to include supplies? e.g. You must have and/or need at least one thing.
// 2. Return an error message if the username is taken.
// 3. Can only decrypt if you have original password. 
// 4. Create, assign, and send the JSON web token. 

// LOGIN
// 1. I have a question about this. WHY LOGIN VALIDATION? JUST RETURN ERRORS IF THE USERNAME OR PASS IS INCORRECT.
// 2. Return an error message if the username doesn't exist.
// 3. Return an error message if the user exists but the password is incorrect.

// RESOURCES
// R1. In requests and responses, where do you put the token? – https://stackoverflow.com/a/43492093