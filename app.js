
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, cons = require('consolidate')
	, io = require('socket.io');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'mustache');

	app.engine('mustache', cons.mustache);

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/multitacz', function(req, res){

	res.set('Content-Type', 'text/html; charset=utf-8');

	res.render('multitacz');
});

var httpServer = http.createServer(app).listen(app.get('port'), '192.168.1.101', function(){
// var httpServer = http.createServer(app).listen(app.get('port'), 'POZMWCOE24316.emea.roche.com', function(){
	console.log("Express server listening on port " + app.get('port'));
});

var websocket = io.listen(httpServer);

websocket.sockets.on('connection', function (socket) {

	// socket.broadcast.emit('te', 'te');

	socket.on('event_data', function (data) {

		socket.broadcast.emit('deviceOnMove', data);

	});
});
