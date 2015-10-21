 // A bot to play the game with players if they can't find a 
 // partner in a timely fashion.

// If a player doesn't find an opponent within 15 seconds, 
// he will start a game with the bot.

// Bot will be assigned to 'client' like any other player.
// must access letterset. 

// Use letters to form words that exist in the dictionary
// and 

var Names = require('./names');
var logic = require('../logic');
var dict = require('../public/dict_obj')

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function sort2DArray (a, b) {
	if (a[1] < b[1]) return -1;
	if (a[1] > b[1]) return 1;
	return 0;
}

function splitArray(array, n) {
	var len = array.length;
	var out = [];
	var i = 0;
	while (i < len) {
		var size = Math.ceil((len - i) / n--);
		out.push(array.slice(i, i += size));
	}
	return out;
}

function letterSetObjToStr(lettersetObj) {
	str = "";
	for (var key in lettersetObj) {
		str += lettersetObj[key];
	}
	return str;
};


function combinations(str) {
    var fn = function(active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active);
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn("", str, []);
}

// function letterSetObjToArr(lettersetObj) {
// 	arr = [];
// 	for (var key in lettersetObj) {
// 		arr.push(lettersetObj[key]);
// 	}
// 	return arr;
// }

// Finding all permutations (and all possible words)
// may prove too costly to be practical here.

// function permutations(arr) {
//     arr = arr.slice();
//     var perms = [],
//         stack = [];

//     function makePerm() {
//         if (arr.length == 0) {
//             perms.push(stack.slice());
//         }
//         for (var i = 0; i < arr.length; i++) {
//             var x = arr.splice(i, 1);
//             stack.push(x);
//             makePerm();
//             stack.pop();
//             arr.splice(i, 0, x);
//         }
//     }
//     makePerm();
//     return perms;
// }

var  BotPlayer = function (partner) {
	this.lifeForm = 'bot';
	this.letterSet = partner.letters;
	this.partner = partner;
	this.username = function() {
					return Names.botnames[Math.floor(
							Math.random() * Names.botnames.length)];
	}();

	this.getValidWords = function() {
		var validWords = [];
		var possibleWords = combinations(letterSetObjToStr(this.letterSet));
		for (var i=0; i<=possibleWords.length; i++) {
			if (dict.eng_dictionary[possibleWords[i]]) {
				var points = logic.score(possibleWords[i]);
				validWords.push([possibleWords[i], points]);
			}
		};
		return validWords;
	};
	this.formatWords = function() {
		// Return 3 arrays of words (low, medium, high)
		var validWords = this.getValidWords();
		var validWordsSorted = validWords.sort(sort2DArray);
		var arrays = splitArray(validWordsSorted, 3);
		return arrays
	};
	this.selectWord = function(words) {
		var low = words[0];
		var medium = words[1];
		var high = words[2];
		var pointsStratified = [low, medium, high];
		// return random points category
		var cat = pointsStratified[Math.floor(
						Math.random()*pointsStratified.length)]
		// return random word within that category
		var word = cat[Math.floor(Math.random()*cat.length)]
		return word;

	};
	this.submitScore = function(score) {

		this.partner.emit('message', {message: this.username + "'s score: " + score})
	};
	this.play = function() {
		var score = 0;
		var words = this.formatWords();
		var _this = this;

		function timer() {
			if (_this.endGame) {
				return;
			};
			var word = _this.selectWord(words);
			console.log(word);
			score += word[1];
			_this.score = score;
			_this.submitScore(score);


			setTimeout(timer, getRandomInt(1000, 15000));
		}
		timer();
	};
};

module.exports.BotPlayer = BotPlayer;
module.exports.getRandomInt = getRandomInt;



