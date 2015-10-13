var express = 		require('express');
var engines = 		require('consolidate');
var mongoose = 		require('mongoose');
var passport = 		require('passport');
var cookieParser = 	require('cookie-parser');
var bodyParser =	require('body-parser');
var session = 		require('express-session');
var flash = 		require('connect-flash');
var port = 3700;

var app = express();

// view engine
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');
var hbs = require('handlebars');
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
app.engine('handlebars', engines.handlebars);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
app.use(session({ secret: 'cjisadickler', resave: true, saveUninitialized: true})); // session secret

// used to pass session to template if necessary
// app.use(function(req, res, next) {
// 	res.locals.session = req.session;
// 	next();
// });
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates. 
var flash = require('connect-flash');
app.use(flash());

//initialize passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// required for mongoose
var dbConfig = require('./db');
mongoose.connect(dbConfig.url);

// socket.io
var io = require('socket.io').listen(app.listen(port));
require('./routes/socket.js')(io);

module.exports = app;