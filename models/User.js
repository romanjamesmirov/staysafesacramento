const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 2, max: 256
	},
	username: {
		type: String,
		required: true,
		min: 2, max: 256
	},
	hashedPassword: {
		type: String,
		required: true,
		min: 8, max: 1024
	},
	have: {
		type: [String],
		required: true
	},
	need: {
		type: [String],
		required: true
	},
	contacts: {
		type: [{
			contact_id: String,
			hasUnread: Boolean
		}],
		default: []
	},
	date: {
		type: Date,
		default: () => (new Date())
	}
});

module.exports = mongoose.model('User', userSchema);