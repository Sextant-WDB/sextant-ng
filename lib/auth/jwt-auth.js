'use strict';

var UserModel = require('../../models/user-model');
var jwt = require('jwt-simple');

/**
 * This middleware determines if an incoming user's token is valid
 */

module.exports = function(app) {

	/**
	 * Define a jwtAuth object with--the important part--an auth method
	 *
	 * (The auth method is all that's passed into the REST router)
	 */

	var jwtAuth = {
		auth: function(req, res, next) {
			var token = (req.body && req.body.jwt) || req.headers.jwt;
			var decoded;

			/**
			 * Decode the token
			 */

			try {
				decoded = jwt.decode(token, app.get('jwtTokenSecret')); //  Note that changing the token secret makes this throw an error!
			} catch(err) {
				return res.status(401).json({ 'msg': 'access denied' });
			}

			/**
			 * Look for the decoded user in the db
			 */

			UserModel.findOne({ '_id': decoded.iss }, function(err, user) {
				if (err) {
					console.log('error in finding user');
					return res.status(500).json(err);
				}
				if (!user) {
					return res.status(401).json({ 'msg': 'access denied' });
				}

				req.user = user;
				req.user.url = user.url;
				next(); // Invoke the subsequent middleware
			});
		}
	};

	return jwtAuth;
};