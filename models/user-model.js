'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

/**
 * Define basic schema for a new user: for now, email, password, and domain to track
 */

var UserSchema = mongoose.Schema({
	id: String,
	sites: Array,
	jwt: String,
	basic: {
		email: String,
		password: String
	}
});

/**
 * Run an incoming password through a one-way hash
 */

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); // 8: larger = more secure, but exponentially slower
};

/**
 * Check incoming password against db's hashed password
 */

UserSchema.methods.matchingPassword = function(password) {
	return bcrypt.compareSync(password, this.basic.password);
};

/**
 * After a user is succesfully authenticated, create a new JWT
 */

UserSchema.methods.createToken = function(app) {

	var expires = moment().add(7, 'days').valueOf();
	var self = this;

	var token = jwt.encode({
		iss: self._id, // basically == id
		expires: expires
	}, app.get('jwtTokenSecret')); // The token we config in server.js

	return token;
};

module.exports = mongoose.model('User', UserSchema);