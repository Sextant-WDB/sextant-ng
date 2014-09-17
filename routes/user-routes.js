'use strict';

var UserModel = require('../models/user-model');

/**
 * API endpoints to create new users and log in existing ones
 */

module.exports = function(app, passport) {

	var api = '/api/0_0_1/users';

	/**
	 * Create new users:
	 *	- Make sure email isn't a duplicate
	 *	- Hash the password
	 *	- Save everything to the db
	 */

	app.post(api, function(req, res) {
	 	UserModel.findOne({ 'basic.email': req.body.email }, function(err, user) {

	 		// Errors, duplicates, etc...
			if (err) {
				console.log('error in search for user!');
				return res.status(500).json(err);
			}
			if (user) {
				console.log('duplicate user');
				return res.status(401).json({ 'msg': 'cannot create user' });
			}

			// ...If we've made it this far, fill in the user model...
			var newUser = new UserModel();
			newUser.basic.email = req.body.email;
			newUser.url = req.body.url;
			newUser.basic.password = newUser.generateHash(req.body.password);

			// ... and save it to the db
			newUser.save(function(err, dbResponse) {
				if (err) {
					return res.status(500).json(err);
				}
				return res.status(200).json({ 'jwt': dbResponse.createToken(app) });
			});

	 	});
	});

	/**
	 * Log in existing users
	 */

	app.get(api,
		passport.authenticate('basic', { session: false }),
		function(req, res) {
			res.json({ 'jwt': req.user.createToken(app) });
		}
	);

	/**
	 * DELETE ALL USERS!!1111 For testing only...
	 */

  app.delete(api, function(req, res) {
    UserModel.remove({}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};