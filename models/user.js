var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	username: String,
	password: String,
	friends: Array,
	wins: {type: Number, default: 0},
	losses: {type: Number, default: 0},
	draw: {type: Number, default: 0}

})