'use strict';

var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');
// var domainModel = require('./models/domain-model.js');

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
require('./routes/data-routes')(app, jwtAuth.auth, cors);

// Init
var server = http.createServer(app);
app.set('port', process.env.PORT || 3000);
exports.port = app.get('port');

// var generateHash = function() {
//   return bcrypt.hashSync(crypto.randomBytes(16).toString('base64'));
// };
// var Domain = mongoose.model('Domain', domainModel );
// var newDomain = new Domain({'host':'somedomain'});
// newDomain.writeKey = generateHash();
// newDomain.save();


server.listen(app.get('port'),function(){
  console.log('Server has started on port %d', app.get('port'));
});
