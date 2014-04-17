/**
 * New node file
 */

var user = require('./routes/user'),
	index = require('./routes/index');
	wall = require('./routes/wall');

module.exports = function(app) {
	app.get('/', index.index);
	app.get('/check', index.check);
	app.get('/login', user.getLogin);
	app.post('/login', user.login);
	//app.get('/register', user.getRegister);
	app.post('/register', user.register);
	app.get('/wall', wall.home);
	app.get('/notifis', wall.notifis);
	app.get('/collection', wall.collection);
	app.post('/logout', user.logout);
/*	app.get('/users', );
	app.get('/friends', );
	app.post('/search', );*/
};