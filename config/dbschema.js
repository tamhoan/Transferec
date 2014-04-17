/**
 * Description how to set up database
 */

var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://bhtest1:25081970@oceanic.mongohq.com:10012/bhtest');

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to test' );
});
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

var file = require('./collection/files')(mongoose),
	friend = require('./collection/friends')(mongoose),
	notification = require('./collection/notifications')(mongoose),
	user = require('./collection/users')(mongoose);
