
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
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
 
function restrict(req, res, next) {
	console.log( req );
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
}

app.get('/login', function (request, response) {
	response.send('<form method="post" action="/login">' +
		'<p>' +
			'<label>Username:</label>' +
			'<input type="text" name="username">' +
		'</p>' +
		'<p>' +
			'<label>Password:</label>' +
			'<input type="password" name="password">' +
		'</p>' +
		'<p>' +
			'<input type="submit" value="Login">' +
		'</p>' +
	'</form>');
});

app.post('/login', function (request, response) {
	var username = request.body.username;
	var password = request.body.password;
	fs.readFile('/var/www/boundstar.com/boundstar/keys.json', 'utf8', function (err, data) {
	// fs.readFile('keys.json', 'utf8', function (err, data) {
		if (err) { console.log('Error: ' + err); return; }
		if ( data ) {
			data = JSON.parse(data);
			if( data[username] !== undefined ) {
				if( password == data[username] ) {
					request.session.regenerate(function(){
						request.session.user = username;
						response.redirect( '/edit_profile?name=' + username );
					});
				}
				else { response.redirect('login');}
			}
			else { response.redirect('login'); }
		}
		else { response.redirect('login'); }
	});
});
// Asynchronous Auth
// var auth = express.basicAuth( function( user, pass, callback ) {
// 	// var result = (user === 'testUser' && pass === 'testPass');
// 	var result;
// 	fs.readFile('keys.json', 'utf8', function (err, data) {
// 		if (err) { console.log('Error: ' + err); return; }
// 		if ( data ) {
// 			data = JSON.parse(data);
// 			console.log( data );
// 			result = (user === user && pass === data[user] );
// 		}
// 		console.log( result );
// 		callback(null /* error */, result);
// 	});
// });

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

// app.get('/', routes.index);

// app.get('/', function(req, res, next) {
//   var document;
//   req.templateData = {
//     weDidSomeCustomRendering: true
//   };
//   document = docpadInstance.getFile({
//     relativePath: 'home.html.md'
//   });
//   return docpadInstance.serveDocument({
//     document: document,
//     req: req,
//     res: res,
//     next: next
//   });
// });

app.get('/edit_profile', restrict, profile.page);

app.get('/player', player.page);

// app.get('/profile', routes.profile );

app.post('/upload', function (req, res) {
	console.log( req.files );
	console.log( req.session );
	fs.readFile(req.files.file.path, function (err, data) {
		// Check more things here
		console.log( req.query.user );
		var newPath = __dirname + "/uploads/" + req.query.user + "_profile." + req.files.file.originalFilename.split('.').pop();
		fs.writeFile(newPath, data, function (err) {
			res.redirect("back");
		});
	});
});
