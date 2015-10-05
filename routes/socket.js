module.exports = function (io) {

	// var players = {};
	// var games = {};
	// var clients = [];
	var waitingClient = null;
	var scores = [];

    io.sockets.on('connection', function (client) {
    	client.on('disconnect', function() {
    		if (waitingClient == client ) 
    			waitingClient = null;
    	});

    	client.on('score', function (score) {
    		client.partner.emit('message', {message: client.username + "'s score: " + score});
    	});

    	client.on('submitScores', function (data) {
    		scores.push(data);
    		if (scores.length == 2) {
    			if (scores[0].score > scores[1].score) {
    				winner = scores[0];
    				loser = scores[1];
    			} else {
    				winner = scores[1];
    				loser = scores[0];
    			}
    		}
    		client.emit('endGame', {winner: winner, loser: loser});
    		client.partner.emit('endGame', {winner: winner, loser: loser});
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

        		client.username = user.username;
        		client.emit('message', {message: "You have joined a game with " + waitingClient.username + "!"})
        		client.partner.emit('getLetterSet', waitingClient.letters);
        		client.emit('getLetterSet', waitingClient.letters);
        		client.partner.emit('message', {message: user.username + " has joined the game!"});
        		client.emit('start');
        		client.partner.emit('start');
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

