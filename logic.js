		// Random float between
	function randomFloatBetween(minValue, maxValue, precision) {
	    if(typeof(precision) == 'undefined'){
	        precision = 2;
	    }
	    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
	}
	

	function randomByWeight (letters) {
		var total = 0;
		for (var key in letters) {
			total += letters[key];
		}
		var r = randomFloatBetween(0, total, 4);
		var upto = 0;
		for (key in letters) {
			if ((upto + letters[key]) > r) {
				return key;
			};
			upto +=letters[key];
		};
	}

var values = {
		   'a': 3, 'b': 10, 'c': 7, 'd': 9, 'e': 1,
		   'f': 10, 'g': 9, 'h': 9, 'i': 4, 'j': 12,
		   'k': 6, 'l': 2, 'm': 9, 'n': 5, 'o': 5, 'p': 9, 
		   'q': 12, 'r': 4, 's': 6, 't': 5, 'u': 8, 
		   'v': 11, 'w': 11, 'x': 12, 'y': 10, 'z': 12 
				}

	function letterSet () {
		// class for generating lettersets.
		// this.values = {
		//    'a': 3, 'b': 10, 'c': 7, 'd': 9, 'e': 1,
		//    'f': 10, 'g': 9, 'h': 9, 'i': 4, 'j': 12,
		//    'k': 6, 'l': 2, 'm': 9, 'n': 5, 'o': 5, 'p': 9, 
		//    'q': 12, 'r': 4, 's': 6, 't': 5, 'u': 8, 
		//    'v': 11, 'w': 11, 'x': 12, 'y': 10, 'z': 12 
		// 		};

		this.weights = {

			'A': 0.079971, 'B': 0.020199, 'C': 0.043593,
			'D': 0.032184, 'E': 0.112513, 'F': 0.014622, 
			'G': 0.022845, 'H': 0.023497, 'I': 0.08563,
			'J': 0.001693, 'K': 0.008535, 'L': 0.060585,
			'M': 0.028389, 'N': 0.071596, 'O': 0.065476,
			'P': 0.029165, 'Q': 0.00183,  'R': 0.07264, 
			'S': 0.066044, 'T': 0.070926, 'U': 0.037091, 
			'V': 0.011369, 'W': 0.008899, 'X': 0.002925,
			'Y': 0.024432, 'Z': 0.00335

			};

		this.vowels = ['A', 'E', 'I', 'O', 'U'];

		this.getLetters = function () {
			// get 8 letters by weighted probability.
			// Not gauranteed to contain a vowel.
			letters = {};
			for (var i=0; i<8; i++) {
				letters[i] = randomByWeight(this.weights);
					};

				return letters
 		  	};

 		this.generate = function () {
 			// generate final letterset;
 			// will contain at least one vowel.
 			while (true) {
 				var letters = this.getLetters();
 				for (key in letters) {
 					if (this.vowels.indexOf(letters[key]) > -1) {
 						return letters
 					}
 				}
 			}
 		}


 }

 // Logic for checking players' submitted scores

 var formulas = {

    	1: [1, 0],
    	2: [20, 2000],
    	3: [70, 7000],
    	4: [80, 8000],
    	5: [100, 10000],
    	6: [120, 12000],
    	7: [140, 15000],
    	8: [180, 20000],
    	9: [220, 25000],
    	10: [260, 30000],
    	11: [350, 40000],
    	12: [440, 50000]
	};


function score(word) {
		var sum = 0;
		for (var i=0; i < word.length; i++) {
			sum += values[word[i].toLowerCase()];
		};

	var factor = formulas[word.length][0];
	var offset = formulas[word.length][1];
	return (factor * sum + offset);

}

 var testBonus = function (bonus, time) {
 	var b = 0;

 	if (time === 'Game Over!') {
 		time = 0;
 	};

 	time = Number(time);
 	if (time > 120) {
 		return false;
 	} else if (time >= 100) {
 		b = time * 100;
 	} else if (time >= 50) {
 		b = time * 200;
 	} else if (time >= 25) {
 		b = time * 300;
 	} else {
 		b = time * 400;
 	}
 	if (b != bonus) {
 		return false
 	} else {
 		return true
 	}
 
 }

 var testWordScores = function (words) {
 	for (var i=0; i<words.length; i++) {
 		if (score(words[i][0]) != words[i][1]) {
 			return false
 		}
 	}
 	return true
 }

 var testTotalScore = function (words, score) {
 	var psum = 0;
 	for (var i=0; i<words.length; i++) {
 		psum += words[i][1];
 	}
 	if (psum != score) {
 		return false
 	}
 	return true
 }

 var testLettersInLetterset = function (words, letterset) {
 	words = words ? words : []
 	lsetarray = [];

 	for (key in letterset) {
 		lsetarray.push(letterset[key]);
 	}

 	for (var i=0; i<words.length; i++) {
 		var r = words[i][0].split('').filter(function(let) {
 			if (lsetarray.indexOf(let) < 0) {
 				return false
 			};
 		})
		}
console.log(r)
	if (r.length > 0) {
		return false;
	}
	return true;
}

var checkScore = function (words, score, letterset, bonus, time) {
	return testLettersInLetterset(words, letterset) &&
		   testWordScores(words) &&
		   testTotalScore(words, score) &&
		   testBonus(bonus, time)
}

exports.letterSet = letterSet;
exports.checkScore = checkScore;
exports.score = score;
