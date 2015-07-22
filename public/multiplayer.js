window.onload = function () {
	var socket = io.connect('http://localhost:3700');
	var title = document.getElementById('title');
	console.log(title);
	socket.on('greeting', function (data) {
		title.innerHTML = data.greeting;

	});

}