const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 2,
		max: 256
	},
	username: {
		type: String,
		required: true,
		min: 2,
		max: 256
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 1024
	},
	have: {
		type: [String], 
		required: true
	},
	need: {
		type: [String],
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);