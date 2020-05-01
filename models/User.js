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
	updates: { // 1. 
		type: [{
			user_id: mongoose.ObjectId,
			newMessages: [{ time: Date, text: String }]
		}], 
		default: []
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);

// 1. Defining an array of objects – stackoverflow.com/questions/19695058