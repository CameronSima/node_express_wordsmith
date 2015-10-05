module.exports = function (io) {

	var players = {};
	var games = {};
	var clients = [];
	var waitingClient = null;

    io.sockets.on('connection', function (client) {
    	client.on('disconnect', function() {
    		if (waitingClient == client ) 
    			waitingClient = null;
    	});
        
        client.on('joinRoom', function (room) {
        	client.join(room);
        });

        client.on('toRoom', function (room, event, msg) {
        	io.to(room).emit(event, msg);
        });

        client.on('joinGame', function (user) {
      
        	// if there is a player waiting for an opponent, join his game
        	if (waitingClient && waitingClient != client) {
        		client.partner = waitingClient;
        		waitingClient.partner = client;
        		console.log(waitingClient.letters);

        		client.emit('message', {message: "You have joined a game with " + waitingClient.username + "!"})
        		client.partner.emit('getLetterSet', waitingClient.letters);
        		client.emit('getLetterSet', waitingClient.letters);
        		client.partner.emit('message', {message: user.username + " has joined the game!"});
        		waitingClient = null;
        		
        	} else {
        		// else, set the client as waitingClient
        		client.emit('message', {message: "Waiting for opponent..."});
        		waitingClient = client;
        		waitingClient.username = user.username;
        		// store player one's letterset so both players 
        		// use the same letterset 
        		waitingClient.letters = user.letters;
        	}
        });

        client.on('toPartner', function (event, msg) {
        	client.partner.emit(event, msg);
        });
    });


}

