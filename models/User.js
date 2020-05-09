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
	connections: {
		type: [String],
		default: []
	}, // 2. 
	updates: { // 1. 
		type: [{
			user_id: mongoose.ObjectId,
			newMessages: [{ time: Date, text: String }]
		}], 
		default: []
	},
	date: {
		type: Date,
		default: () => (new Date())
	}
});

module.exports = mongoose.model('User', userSchema);

// 1. So that we know, when the logged-in user clicks on a person, if to fetch for a chatroom or not. Don't fetch if they haven't talked before.
// 2. Defining an array of objects – stackoverflow.com/questions/19695058