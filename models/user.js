var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	username: String,
	password: String,
	friends: Array,
	wins: Number,
	losses: Number
})