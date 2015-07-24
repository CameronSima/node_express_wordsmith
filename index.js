var express = 		require('express');
var engines = 		require('consolidate');
var mongoose = 		require('mongoose');
var passport = 		require('passport');
var cookieParser = 	require('cookie-parser');
var bodyParser =	require('body-parser');
var session = 		require('express-session');
var port = 3700;

var app = express();

// view engine
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');
app.engine('handlebars', engines.handlebars);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use(cookieParser()); // read cookies (needed for auth)


 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates. socket.io instead???
var flash = require('connect-flash');
app.use(flash());

// required for passport
app.use(session({ secret: 'cjisadickler', resave: true, saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


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
io.sockets.on('connection', function (socket) {
	socket.emit('greeting', { greeting: "Welcome to room 3453!"})
});

// module containing game logic
// logic = require('./logic');
// module.exports = logic;

module.exports = app;