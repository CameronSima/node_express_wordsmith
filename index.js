var express = require('express');
var app = express();
var engines = require('consolidate')
var port = 3700;

app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');
app.engine('handlebars', engines.handlebars);

app.get('/', function(request, response) {
	response.render('page', data = {message: 'Hello!'});
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	socket.emit('greeting', { greeting: "Welcome to room 3453!"})
});