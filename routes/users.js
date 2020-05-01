const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res) => { // 1 
	const allUsersUnsafe = await User.find({});
	const allUsersSafe = allUsersUnsafe.map(user => ({
		name: user.name,
		username: user.username,
		have: user.have,
		need: user.need
	})); // 2
	res.json(allUsersSafe);
});

router.get('/:username', async (req, res) => {
	const { username } = req.params;
	const userUnsafe = await User.findOne({ username });
	if (userUnsafe === null) return res.status(404).send(`A user with the username of ${username} was not found.`);
	const userSafe = userUnsafe.map(user => ({
		name: user.name,
		have: user.have,
		need: user.need
	}));
	res.json(userSafe);
});

module.exports = router;

// USERS
// 1. Get a list of all users.
// 2. Don't send passwords. 