/**
 * New node file
 */
var socketio = require('socket.io'),
	session = require('./stream/session-infor'),
	WebSocketServer = require('ws').Server;

var io, sessionSockets;
var counter = 0;
var all_websockets = {},
	friends = {};

exports.listen = function(server) {
	io = socketio.listen(8000);
	io.set('log level', 1);
	
	var wallStream = require('./stream/wall-stream')(io, session);
	var roomStream = require('./stream/room-stream')(io, server);
};
