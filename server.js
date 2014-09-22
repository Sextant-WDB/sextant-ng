'use strict';

var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

// Config
var app = express();


app.use(express.static(__dirname + '/build'));
app.use(bodyparser.json());

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost/sextant');

// Auth
app.set('jwtTokenSecret', process.env.JWT_SECRET || 'changeMeChangeMeChangeMe');
app.set('secret', process.env.SECRET || 'changeMeChangeMeChangeMe'); // We never actually use this; passport just requires it

app.use(passport.initialize());
require('./lib/auth/passport')(passport);

// Routing
var jwtAuth = require('./lib/auth/jwt-auth')(app);

require('./routes/user-routes')(app, passport);
require('./routes/data-routes')(app, jwtAuth.auth);

// Init
var server = http.createServer(app);
app.set('port', process.env.PORT || 3000);
exports.port = app.get('port');

server.listen(app.get('port'),function(){
  console.log('Server has started on port %d', app.get('port'));
});
