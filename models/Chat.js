const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
	users: { 
		type: [String],
		required: true
	},
	pastMessages: {
		type: [{
			from: Number, // User index in `users` array  
			when: Date,
			text: String
		}], 
		default: []
	}
});

module.exports = model('Chat', chatSchema);