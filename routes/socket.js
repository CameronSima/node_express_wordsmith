

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		socket.emit('message', {message: "Waiting for player..."})
		socket.on('create', function (newRoom) {
			var rooms = io.sockets.adapter.rooms;
			var clients = function (rm) {
				return io.of('/').adapter.rooms[rm];
			};
			// console.log(newRoom)

			// if any of the current rooms have only one
			// player, join that room.
			for (room in rooms) {
				// console.log(room)
				if (Object.keys(clients(room)).length == 1) {
					// console.log(Object.keys(clients(room)).length);
					socket.join(room);
					socket.emit('player_found')
								
			} else {
				socket.join(newRoom);
			}
		}

		// console.log(io.sockets.adapter.rooms)
	
	})
	})

}
