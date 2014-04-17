/**
 * New node file
 */
var io, WebSocketServer = require('ws').Server;

var counter = 0;
var all_websockets = {}, roomNames = {}, roomOwner = {}, roomMember = {};

module.exports = function(ioSystem, server) {
	var wss = new WebSocketServer({
		server : server
	});
	wss.on('connection', function(ws) {
		var startTime = 0;
		console.log('--------');
		var audioQueue = [];
		var drawQueue = [];
		var first = 0;
		var first = 0;
		ws.on('open', function() {
			ws.send('something');

		});
		ws.on('message', function(message) {
			
			if (typeof message == 'string') {
				try {
					var jsonms = JSON.parse(message);
					if ((jsonms[0] == 'touch_start')
							|| (jsonms[0] == 'touch_move')) {
						sendAll(ws, message);
					} else if (jsonms[0] == 'join') {
						ws.room = jsonms[1]; // jsonms[2] : name of room
						if (ws.id == ws.room) {
							createRoom(ws);
						} else {
							roomMember[ws.room].push(ws.id);
							console.log(ws.id + ' has join ' + ws.room);
						}

					} else if (jsonms[0] == 'drawList') {
						console.log('Emit DrawList');
						sendDrawList(ws);

					} else if (jsonms[0] == 'request') {
						console.log(jsonms);
						requestJoin(ws, jsonms);

					} else if (jsonms[0] == 'response') {
						console.log(jsonms);
						responseJoin(ws, jsonms);

					} else if (jsonms[0] == 'leave') {
						leaveRoom(ws);

					} else if (jsonms[0] == 'email') {
						ws.id = jsonms[1]; // assign ws.id equal user's email
						all_websockets[ws.id] = ws;
						console.log(ws.id);

					}
				} catch (e) {
					console.log(message);
					
						all_websockets['1234'] = ws;
					
				}
			} else {
				//console.log(message);
				sendAll(ws, message);
				if (all_websockets['1234'] !== null) {
					all_websockets['1234'].send(message,{binary:true});
					//console.log(message);
				}
				
				first++;
				/*
				 * audioQueue.push(message);
				 * 
				 * if(startTime == 0) { startTime = 1; setTimeout(function() {
				 * while(audioQueue.length>0) { sendAll(ws,
				 * audioQueue.pop()); console.log('AudioQueue\'s length of ' +
				 * ws.id + ' is : ' + audioQueue.length); } }, 5000); }
				 */
			}
		});

		ws.on('close', function() {
			console.log('stopping client interval: ');
			leaveRoom(ws);
			delete all_websockets[ws.id];
			// console.log(all_websockets);
		});

		ws.on('error', function(err) {
			console.log(err);
		});
	});
};

function createRoom(ws) {
	var id = ws.id;
	roomNames[id] = id;
	roomOwner[id] = id;
	roomMember[id] = new Array();
	roomMember[id].push(id);
	console.log(roomMember);
}

function sendDrawList(ws) {
	var msg = [ 'drawList' ];
	for ( var index in roomNames) {
		msg.push(roomNames[index]);
	}
	msg = JSON.stringify(msg);
	ws.send(msg);
	console.log(msg);
}

function requestJoin(ws, jsonms) {
	var msg = [ 'request', ws.id ];
	msg = JSON.stringify(msg);
	all_websockets[jsonms[1]].send(msg);
	console.log(msg + 'send to ' + jsonms[1]);
}

function responseJoin(ws, jsonms) {
	var msg = [ 'response', ws.id, jsonms[2] ];
	msg = JSON.stringify(msg);
	all_websockets[jsonms[1]].send(msg);
	console.log(msg + 'send to ' + jsonms[1]);
}

function leaveRoom(ws) {
	if (ws.room != null) {
		if (ws.room == ws.id) {
			var id = isInArray(roomNames, ws.name);
			delete roomNames[id];
			delete roomMember[ws.room];
			// console.log('After delete member----' + roomMember[ws.room]);
			// console.log('Leave room --- Delete room by owner');
		} else {
			if (roomMember[ws.room]) {
				var id = isInArray(roomMember[ws.room], ws.id);
				delete roomMember[ws.room][id];
				// console.log('Leave room --- Guest leave');
			}
		}
		ws.room = null;
	}
}

function sendAll(ws, message) {
	// Send message to all members in room
	if (roomMember[ws.room]) {
		var members = roomMember[ws.room];
		var length = members.length;
		var tmp_socket;

		for (i = 0; i < length; i++) {
			tmp_socket = all_websockets[members[i]];
			if (tmp_socket != null)
				if (tmp_socket.id != ws.id)
					tmp_socket.send(message);
		}
	}
}

function isInArray(array, element) {
	var result = -1;
	for ( var prop in array) {
		if (array.prop == element) {
			result = prop;
			break;
		}
	}
	return result;
}