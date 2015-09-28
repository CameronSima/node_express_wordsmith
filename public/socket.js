window.onload = function () {
	var socket = io.connect('http://localhost:3700/');
	var messageBox = document.getElementById('message_box');

	socket.on('message', function (data) {
		

			messageBox.innerHTML = data.message;
			console.log(data);

		
	});

	socket.on('player_found', function (data) {
		messageBox.innerHTML = "Player " + data.username + " joined!";
	})

	socket.emit('create', 'ROOM: ' + loggedInUser._id);
}