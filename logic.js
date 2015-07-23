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

	function letterSet () {
		// class for generating lettersets.
		this.values = {
		   'a': 3, 'b': 10, 'c': 7, 'd': 9, 'e': 1,
		   'f': 10, 'g': 9, 'h': 9, 'i': 4, 'j': 12,
		   'k': 6, 'l': 2, 'm': 9, 'n': 5, 'o': 5, 'p': 9, 
		   'q': 12, 'r': 4, 's': 6, 't': 5, 'u': 8, 
		   'v': 11, 'w': 11, 'x': 12, 'y': 10, 'z': 12 
				};

		this.weights = {

			'A': 0.079971, 'B': 0.020199, 'C': 0.043593,
			'D': 0.032184, 'E': 0.112513, 'F': 0.014622, 
			'G': 0.022845, 'H': 0.023497, 'I': 0.08563,
			'J': 0.001693, 'K': 0.008535, 'L': 0.060585,
			'M': 0.028389, 'N': 0.071596, 'O': 0.065476,
			'P': 0.029165, 'Q': 0.07264,  'R': 0.00183, 
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

exports.letterSet = letterSet;
