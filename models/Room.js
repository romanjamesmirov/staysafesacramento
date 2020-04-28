const mongoose = require('mongoose');

// For socket.io to emit to this specific room by using the name of the room, we'll use the _id and stringify it. 
const roomSchema = new mongoose.Schema({
	people: { // Two required... that's how DM's work
		type: [String],
		required: true
	},
	messages: {
		type: Array, // Update later. Maybe it'll be [Map]
		required: true
	}
});

module.exports = mongoose.model('Room', roomSchema);