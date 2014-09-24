'use strict';

var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');

// Config
var app = express();

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/build/public'));

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
require('./routes/data-routes')(app, cors);
require('./routes/visit-routes')(app, jwtAuth.auth);
require('./routes/domain-routes')(app, jwtAuth.auth);
require('./routes/provision-tracker-routes')(app, cors);

// Init
var server = http.createServer(app);
app.set('port', process.env.PORT || 3000);
exports.port = app.get('port');

server.listen(app.get('port'),function(){
  console.log('Server has started on port %d', app.get('port'));
});
