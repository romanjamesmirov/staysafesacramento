const mongoose = require('mongoose');
const { v4 } = require('uuid');

const chatroomSchema = new mongoose.Schema({
	id: {
		type: String,
		default: v4()
	},
	users: { 
		type: [mongoose.ObjectId],
		required: true
	},
	messages: {
		type: [{
			sender: mongoose.ObjectId,
			time: Date,
			text: String
		}], 
		default: []
	}
});

module.exports = mongoose.model('Chatroom', chatroomSchema);