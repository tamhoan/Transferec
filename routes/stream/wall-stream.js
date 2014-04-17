/**
 * New node file
 */
var mongoose = require('mongoose'),
	File = mongoose.model('File'),
	Friend = mongoose.model('Friend'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification');
var utils = require('utils'),
	noticeTypes = utils.NoticeType,
	userStatus = utils.UserStatus;
var session;

var io;

module.exports = function(iosystem, sessionSystem) {
	io = iosystem;
	session= sessionSystem;
	io.on('connection', function(socket) {
/*		globalValue(socket);
		searchUser(socket);
		handleClientNotification(socket);
		handleClientDisconnect(socket);*/
		socket.on('message', function(msg){
			console.log('Receive msg: '+msg);
		});
	});
};

function globalValue(socket) {
	socket.on('session', function(argument){
		session.Id[socket.id] = argument._id;
		session.Email[socket.id] = argument.email;
		session.Socket[argument._id] = socket.id;
		console.log("Session's email: " +session.Email[socket.id]);
	});
}

function searchUser(socket) {
	socket.on('search', function(argument) {
		var email = argument.email;
		console.log("Wall-stream:: search: "+email);
		var result;
		User.find({
			'email' : new RegExp(email, "i")
		},'email status ', function(err, user) {
			if (err) {
				result = '500';
			} else {
				if (user) {
					result = user;
				} else {
					result = '404';
				}
			}
			socket.emit('result', {
				user : result
			});
		});
	});
}

function handleClientNotification(socket){
	socket.on('notification', function(argument) {
		var type = argument.type;
	
		if(type == noticeTypes.ADD_FRIEND) {
			onRequestAddFriend(socket.id, argument);
		} else if(type == noticeTypes.ACCEPT_FRIEND) {
			onReplyAddFriend(socket.id, argument);
		} else if(type == noticeTypes.GIVE_FILE) {
			
		}
	});
}

function onRequestAddFriend(idSender, argument) {
	var desireId = argument.desireId;
	sendNotification(idSender, desireId,
			noticeTypes.ADD_FRIEND, '');
}

function onReplyAddFriend(idSender, argument) {
	var desireId = argument.desireId,
		reply = argument.reply;
	
	if(reply == 'true') {
		Friend.create({
			user1: desireId,
			user2: session.Id[idSender]
		}, function(err, friend) {
			if(!err) {
				sendNotification(idSender, desireId,
						noticeTypes.ACCEPT_FRIEND, reply);
			}
		});
	} else {
		sendNotification(idSender, desireId,
				noticeTypes.ACCEPT_FRIEND, reply);
	}
}

function onGiveFile(idSender, argument) {
	var desireId = argument.desireId,
		fileName = argument.fileName;
	File.create({
			ownerId: desireId,
			name: fileName
		}, function(err, file) {
			if(!err) {
				sendNotification(idSender, desireId,
						noticeTypes.GIVE_FILE, '_file'+fileName);
			}
	});
}

function sendNotification(idSender, desireId, noticeType, contentNotify, file) {
	var nameSender = session.Email[idSender];
	
	Notification.create({
		senderId : session.Id[idSender],
		receiverId : desireId,
		type : noticeType,
		content : contentNotify,
	}, function(err, notification) {
		if (err) {
			
		} else {
			if (session.Id.indexOf(desireId)) {
				io.sockets.socket(session.Socket[desireId]).emit('notification', {
					senderName : nameSender,
					type : noticeType,
					content : contentNotify,
				});
				notification.seen = 1;
				notification.save();
			}
		}
	});
}

function handleClientDisconnect(socket) {
	
	socket.on('disconnect', function() {
		//console.log("User "+ user.email +" has disconnect");
		if (session.Id[socket.id])
			if (session.Status[socket.id] = userStatus.ONLINE){
			User.findOne({
				email: session.Email[socket.id]
			}, function(err, user) {
				if(user) {
					user.online = false;
					user.save();
					console.log("Wall-stream:: User "+ user.email +" has disconnect");
				}
			});

			delete session.Id[socket.id];
			delete session.Email[socket.id];
			delete session.Socket[session._id];
		}
	});
}

