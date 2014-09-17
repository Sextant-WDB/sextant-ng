'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var UserModel = require('../../models/user-model');

/**
 * Describe the conditions for a successful passport request
 *
 * (BTW, this is only called when users sign in directly: account creation
 * and already-signed-in JWT auth both skip this process)
 */

module.exports = function(passport) {
	passport.use('basic', new BasicStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		UserModel.findOne({ 'basic.email': email },
		function(err, user) {

			// Check for errors, missing users, nonmatching passwords...
			if (err) {
				console.log('error in passport');
				return done(err);
			}
			if (!user) {
				console.log('passport: no user found');
				return done(null, false);
			}
			if (!user.matchingPassword(password)) {
				console.log('passport: password doesn\'t match');
				return done(null, false);
			}

			// ...If no errors, return the validated user
			return done(null, user);
		});
	}));
};