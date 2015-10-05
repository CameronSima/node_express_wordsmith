window.onload = function () {
    var socket = io.connect('http://localhost:3700');
    var messageBox = document.getElementById('message_box');
 

    socket.on('message', function (data) {
            messageBox.innerHTML = data.message;
            if (data.message.substr(data.message.length - 3) == '...') {
            	(function pulse() {
            		$(messageBox).delay(200).fadeOut('slow').delay(50).fadeIn('slow', pulse);
            		if (pulse == false) {
            			return;
            		}
            }
            )();
            } else {
            	$(messageBox).stop();
            };



		
    });

    socket.on('getLetterSet', function (letters) {
    		letterset = letters;
    		populate();
    });

    socket.on('start', function () {
    	start();
    });

    socket.on('endGame', function (results) {
    	displayWinnerModal(results);
    })

    socket.emit('joinGame', {"id": loggedInUser._id, 
	    					 "username": loggedInUser.username,
	    					 "friends": loggedInUser.friends,
	    					 "letters": letterset });

}
