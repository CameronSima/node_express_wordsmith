var mongoose = require('mongoose');

module.exports = mongoose.model('Score', {
	player_name: String,
	score: Number,
	score_date: Date
})