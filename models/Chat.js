const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
	people: { 
		type: [mongoose.ObjectId],
		required: true
	},
	messages: {
		type: [{
			sender: mongoose.ObjectId,
			time: Date,
			text: String
		}], 
		required: true
	}
});

module.exports = mongoose.model('Chat', chatSchema);