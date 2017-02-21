var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./server/routes/index');
var users = require('./server/routes/users');
var messages = require('./server/routes/messages');
var comments = require('./server/routes/comments');

// app.use(function (req, res, next) {
// 	let headers = JSON.stringify(req.headers);
// 	console.log(`headers: ${headers}`);
// 	next();
// });

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use('/uploads', express.static(__dirname + "/uploads"));

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/messages', messages)
app.use('/api/comments', comments)


// Set Port
app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
