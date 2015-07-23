var express = require('express');
var router = express.Router();
var logic = require('../logic');

ls = new logic.letterSet;
console.log(ls.generate())

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function (passport) {

	router.get('/', function(request, response) {
		response.render('page');

	});

	// GET login page
	router.get('/login', function(req, res) {
		console.log(req, res)
		res.render('login', { message: req.flash('message')});
	});

	// login POST
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));

	// GET registration page
	router.get('/signup', function(req, res) {
		res.render('register', { message: req.flash('message')});
	});

	// Handle registration POST
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
	  req.logout();
	  res.redirect('/');
});

		/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
	  res.render('home', { user: req.user });
	});
	 
	return router;


}