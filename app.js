
/**
 * Module dependencies.
 */

var express = require('express')
	,http = require('http')
	,path = require('path');

var db = require('./config/dbschema');
var app = express();
var cookieParser = express.cookieParser('your secret sauce')
	,sessionStore = new express.session.MemoryStore();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({ store: sessionStore }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// create all routes
var routes = require('./allroutes')(app);

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var transfer = require('./routes/transfer');
transfer.listen(server);
