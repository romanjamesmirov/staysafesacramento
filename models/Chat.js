const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
	users: { 
		type: [mongoose.ObjectId],
		required: true
	},
	history: {
		type: [{
			from: Number, // Index of chat.users 
			when: Date,
			text: String
		}], 
		default: []
	}
});

module.exports = mongoose.model('Chat', chatSchema);