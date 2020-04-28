const router = require('express').Router();
const User = require('../models/User');

/*
						GET LIST OF ALL PEOPLE
*/

router.get('/', async (req, res) => {
	const users = await User.find({});
	const people = users.map(user => {
		return {
			name: user.name,
			username: user.username,
			have: user.have,
			need: user.need
		};
	}); // Don't send passwords. 
	res.json(people);
});

module.exports = router;