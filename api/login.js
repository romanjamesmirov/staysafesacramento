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
	const token = jwt.sign({ _id }, process.env.TOKEN_SECRET);
	const contacts = withoutIds(user.contacts);
	res.json({ name, have, need, contacts, token });
};


/* 

OI! I have a very important question. Why are we sending contacts upon login? Just send the _ids and hasUnread! It's safe to pass _ids. Who the fuck cares anyway? You're nobody, nobody's on this site to even make it worth hacking. Pass _id's, don't pass all these contacts' data. Do that when the user visits staysafe.com/contacts. Then redux will make a fetch. But not here. 

*/


// Don't send Mongo _id's of contacts – replace with public user data.
async function withoutIds(contacts) {
	const newContacts = [];
	for (let i = 0; i < contacts.length; i++) {
		const contact = await User.findOne(contacts[i].user_id);
		if (!contact) continue;
		const { name, username, need, have } = contact;
		const { hasUnread } = contacts[i];
		newContacts.push({ name, username, need, have, hasUnread })
	}
	return newContacts;
}

// QUESTIONS
// #Q1 – I have a question about login user data validation. WHY LOGIN VALIDATION? JUST RETURN ERRORS IF THE USERNAME OR PASS IS INCORRECT.