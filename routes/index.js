var express = require('express');
var router = express.Router();
var logic = require('../logic');
var Score = require('../models/scores');
var User = require('../models/user');
var letterset;

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function (passport) {

	// GET main page
	router.get('/', function(request, response) {
		Score.find().sort({'score': 'desc'}).limit(5).exec(function(err, score) {
	if (err) {
		console.log(err);
		return;
	}
	
	var letterset = new logic.letterSet().generate();
		response.render('page', { letterset: JSON.stringify(letterset),
								  scores:  score,
								  loggedInUser: JSON.stringify(request.user || null)});
})
	});

	// POST main page
	router.post('/', function (req, res) {
		var r = req.body;
		console.log(r);

		// send new letters instead of reloading 
		// the whole page.

		// if (r.new_letters) {
		// 	letterset = new logic.letterSet().generate();
		// 	res.send(JSON.stringify(letterset))
		// }

		// don't enter scores if no words were submitted,
		// or if data doesn't pass cheat tests.
		if (r.words && logic.checkScore(r.words, r.score, 
							 letterset, r.bonus, r.time)) {
			
			var score = new Score({ player_name: r.name,
									score: r.score + r.bonus,
									score_date: Date.now() });

			score.save(function (error) {
				if (error) {
					console.log(error)
				};
			})
		}
		res.end()
	})

	// GET login page
	router.get('/login', function (req, res) {
		//console.log(req, res)
		res.render('login', { message: req.flash('message')});
	});

	// login POST
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	})

	// GET registration page
	router.get('/signup', function (req, res) {
		res.render('register', { error: req.flash('error')});
	});

	// Handle registration POST
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	/* Handle Logout */
	router.get('/signout', function (req, res) {
	  req.logout();
	  res.redirect('/');
});

	router.get('/scores', function (req, res) {
		User.find().sort({'wins': 'desc'}).limit(100).exec(function(error, mult_score) {
			if (error) {
				console.log(error);
				return
			};

		Score.find().sort({'score': 'desc'}).limit(100).exec(function(error, score) {
			if (error) {
				console.log(error);
				return
			};
			res.render('scores', {score: score, mult_score: mult_score});

		});
	});
	})

	router.get('/rules', function (req, res) {
		res.render('rules');
	});

	router.get('/multiplayer',  function (req, res) {
		if (!req.isAuthenticated()) {
			res.redirect('/login');
		} else {

		var letterset = new logic.letterSet().generate();
		res.render('multiplayer', { letterset: JSON.stringify(letterset),
									loggedInUser: JSON.stringify(req.user),
									// non-stringified user object for displaying data in template
									playerRecord: req.user});
		}
	});

	return router;


}