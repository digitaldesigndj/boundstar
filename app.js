
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var profile = require('./routes/profile');
var player = require('./routes/player');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, im hunting wabbitsss'));
app.use(express.session());
app.use(express.favicon("src/files/favicon.ico")); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'out')));

server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// Add DocPad to our Application
var docpadInstanceConfiguration = {
	// Give it our express application and http server
	serverExpress: app,
	serverHttp: server,
	// Tell it not to load the standard middlewares (as we handled that above)
	middlewareStandard: false
};
var docpadInstance = require('docpad').createInstance(docpadInstanceConfiguration, function(err){
	if (err)  return console.log(err.stack);

	// Tell DocPad to perform a generation, extend our server with its routes, and watch for changes
	docpadInstance.action('generate server watch', function(err){
		if (err)  return console.log(err.stack);
	});
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

