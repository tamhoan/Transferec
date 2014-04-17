/*
 * GET users listing.
 */

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	userStatus = require('utils').UserStatus;

exports.getLogin = function(req, res) {
	res.render('login', {
		title: 'login',
		err: null
	});
};

exports.getRegister = function(req, res) {
	res.render('register', {
		
	});
};

exports.login = function(req, res) {
	console.log("User:: infor "+req.body.email + ': ' + req.body.password);
	User.findOne({
		'email': req.body.email,
		'password': req.body.password
	}, function(err, user) {
		if(err) {
			res.statusCode = 500;
			console.log("User::" + err);
		} else {
			if(user) {
				res.statusCode = 200;
				if(user.status > userStatus.OFFLINE) {
					res.end('Already login by other person');
				} else {
					req.session._id = user._id;
					req.session.email = user.email;
					console.log('Uer:: Login with user\'s email:' + user.email);
					res.end(''+user._id);
					//res.redirect('/notifis');
					//user.online = true;
					user.save();
				}
			} else {
				res.statusCode = 404;
				res.end('Not Found User');
			}
		}
		//res.end();
	});
};

exports.register = function(req, res) {
	User.create({
		'email': req.body.email,
		'password': req.body.password,
		'status': userStatus.ONLINE
	}, function(err, user) {
		if(err) {
			if(err.code == 11000) {
				res.statusCode = 302;
				console.log("User:: " +err);
			} else if(err.name == 'ValidationError') {
				res.statusCode = 303;
				res.end('User:: Password And Email is required');
			} else {
				res.statusCode = 500;
			}
		} else {
			res.statusCode = 200;
			console.log("User:: Register Successfull");
		}
	});
};

exports.changePass = function(req, res) {
	if(req.seesion.email) {
		User.findOneAndUpdate({
			'email' : req.session.email,
			'password' : req.body.password,
		}, {
			'password' : req.body.newPassword
		}, function(err, User) {
			if(err) {
				res.statusCode = 500;
			} else {
				res.statusCode = 200;
			}
			res.end();
		});
	}
};

exports.logout =function (req, res) {
	if(req.session.email) {
		User.findOne({
			'email': req.session.email
		}, function(err, user) {
			user.status = userStatus.OFFLINE;
		});
		req.session.destroy();
		res.end("Logout");
		console.log('logout');
	}
};