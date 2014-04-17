/**
 * New node file
 */

var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.Types.ObjectId,
	Notification = mongoose.model('Notification'),
	User = mongoose.model('User'),
	Friend = mongoose.model('Friend');

exports.home = function(req, res) {
	Friend.find({'user1': req.session._id}, 'user2')
		.populate('user2', 'email status')
		.exec(function(err, friends){
			if(err) {
				res.statusCode = 500;
				res.end();
			} else {
				var homeBody = {};
				var i=0;
				if(friends){
					friends.forEach(function(friend){
						homeBody[i] = {
							'email': friend.user2.email,
							'online': friend.user2.online,
							'_id': friend.user2._id,
						};
						i++;
					});
					Friend.find({user2: req.session._id}, 'user1')
					.populate('user1', 'email online')
					.exec(function(err, friendUser2){
						if(friendUser2){
							friendUser2.forEach(function(friend){
								homeBody[i] = {
									'email': friend.user1.email,
									'online': friend.user1.online,
									'_id': friend.user1._id,
								};
								i++;
							});
						}
						res.json(homeBody);
					});
				}
			}
		});	
};

exports.notifis = function(req,res) {
	console.log('Wall:: Session_id request: '+req.session._id);
	Notification.find({
		receiverId : req.session._id,
	}, 'senderId notifiType content seen')
	.populate('senderId', 'email')
	.exec( function(err, notifications) {
		if(notifications) {
			res.json(notifications);
		} else {
			res.statusCode = 404;
			res.end();
		}
	});
};

exports.collection = function(req, res) {
	var collection = require('../config/create-sample-collection');
	collection.createSample();
	res.end();
};
