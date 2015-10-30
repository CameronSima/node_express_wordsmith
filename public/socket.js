debug = false;

if (debug) {
    var url = 'http://localhost:3700';
} else {
    var url = 'http://wordsmith.es';
};

window.onload = function () {
    var socket = io.connect(url);
    var messageBox = document.getElementById('message_box');

 

    socket.on('message', function (data) {
            messageBox.innerHTML = data.message;
            if (data.message.substr(data.message.length - 3) == '...') {
            	(function pulse() {
            		$(messageBox).delay(200).fadeOut('slow').delay(50).fadeIn('slow', pulse);
            }

            )();
            } else {
            	$(messageBox).stop(goToEnd=true).fadeIn();

            };
		
    });

    socket.on('getLetterSet', function (letters) {
    	if (letters) {
    		letterset = letters;
    		populate();
    	} 
    });

    socket.on('start', function () {
    	start();
    });

    socket.on('endGame', function (results) {
    	if (results.tie) {
    		displayTieModal(results);
    	} else {
    	displayWinnerModal(results);
    	}
    });

    socket.emit('joinGame', {"id": loggedInUser._id, 
	    					 "username": loggedInUser.username,
	    					 "friends": loggedInUser.friends,
	    					 "letters": letterset });

}
