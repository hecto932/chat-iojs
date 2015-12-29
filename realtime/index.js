'use strict';

const socketio = require('socket.io')
const database = require('../database')
const helper = require('../helper')

module.exports = function (server){
	const db = database()
	const io = socketio(server)
	let users = 0

	io.on('connection', onConnection)

	function onConnection(socket){
		users++
		console.log(`Users : ${users}`)
		console.log(`Client connected ${socket.id}`)
		socket.emit('User connected', { users : users })

		db.list(function(err, messages){
			if(err) return console.log(err)

			socket.emit('messages', messages)
		})

		socket.on('message', function(message){
			const converter = helper.convertVideo(message.frames)
			converter.on('log', console.log)
			converter.on('video', function(video){
				delete message.frames
				message.video = video

				db.save(message, function(err){

				})

				socket.broadcast.emit('message', message)

				socket.emit('messageack', message)
			})
		})

		socket.on('disconnect', function () {
	    	users--
	    	io.emit('User disconnected', { users : users })
	    	console.log(`Users : ${users}`)
	  	});
	}

	
}