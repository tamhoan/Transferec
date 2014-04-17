/**
 * New node file
 */
var mongoose = require('mongoose'),
	File = mongoose.model('File'),
	Friend = mongoose.model('Friend'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification');

exports.createSample = function() {
/*	var demoSchema = new mongoose.Schema({
		x: Number
	});
	mongoose.model('Demo', demoSchema);
	
	var Demo = mongoose.model('Demo');
	var i = 0;
	for(i=0; i<22; i++) {
		Demo.create({
			x: i
		});
	}*/
	var i;
	for(i = 0; i<4; i++) {
		User.create({
			email: i+'@test',
			password: 'pass'+i,
			status: 0
		});
	}

/*	Notification.create({
		senderId: "53083e5a04ce82921e83b820",
		receiverId: "53083e6604ce82921e83b821",
		notifyType: 0,
		content:'',
		seen: 0,
	});
	
	Notification.create({
		senderId: "53083e5a04ce82921e83b820",
		receiverId: "53083e6f04ce82921e83b822",
		notifyType: 1,
		content: 'false',
		seen: 0,
	});
	
	Notification.create({
		senderId: "53083e6604ce82921e83b821",
		receiverId: "53083e6f04ce82921e83b822",
		notifyType: 2,
		content:'',
		seen: 0,
	});
	
	Notification.create({
		senderId: "53083e6f04ce82921e83b822",
		receiverId: "53083e6604ce82921e83b821",
		notifyType: 0,
		content: '',
		seen: 1,
	});*/
};
