var express = require('express');
var router = express.Router();
var logic = require('../logic');
var Score = require('../models/scores')


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function (passport) {

	// GET main page
	router.get('/', function(request, response) {
		letterset = new logic.letterSet().generate();
		response.render('page', { letterset: JSON.stringify(letterset) });

	});

	// POST main page
	router.post('/', function (req, res) {
		var r = req.body;
		if (r.new_letters) {
			letterset = new logic.letterSet().generate();
			res.send(JSON.stringify(letterset))
		}
		

		console.log(r)
		console.log(res)
		if (logic.checkScore(r.words, r.score, 
							 letterset, r.bonus, r.time)) {
			console.log("OK")
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

	// GET registration page
	router.get('/signup', function (req, res) {
		res.render('register', { message: req.flash('message')});
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

		/* GET Home Page */
	router.get('/home', isAuthenticated, function (req, res){
	  res.render('home', { user: req.user });
	});
	 
	return router;


}