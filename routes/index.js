/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};

exports.check = function(req, res) {
/*	var mongoose = require('mongoose'),
		Demo = mongoose.model('Demo');
	Demo.find({}, function(err, demos) {
		res.json(demos);
	});*/
	
	/*res.render('checkSS');*/
};
