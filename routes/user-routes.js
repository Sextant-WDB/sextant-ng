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
	 	UserModel.findOne({
	 		'basic.email': req.body.email
	 	}, function(err, user) {

			if (err) {
				console.log('error in search for user!');
				return res.status(500).json(err);
			}
			if (user) {
				return res.status(401).json({
					'message': 'cannot create user'
				});
			}

			var newUser = new UserModel();
			newUser.id = Math.floor(Math.random() * 10); // For testing only
			newUser.basic.email = req.body.email;
			newUser.basic.password = newUser.generateHash(req.body.password);

			newUser.save(function(err, dbResponse) {
				if (err) {
					return res.status(500).json(err);
				}
				dbResponse.jwt = dbResponse.createToken(app);
				dbResponse.id = newUser.id;
				return res.status(200).json(dbResponse);
			});

	 	});
	});

	/**
	 * Log in existing users
	 */

	app.get(api,
		passport.authenticate('basic', { session: false }),
		function(req, res) {
			res.json({
				'jwt': req.user.createToken(app)
			});
		}
	);

	/**
	 * Update a user
	 */

	app.put(api + '/:id', function(req, res) {
		var data = req.body;
		console.log(JSON.stringify(data));
    delete data._id;
    UserModel.findOneAndUpdate({
    	'_id': req.params.id
    }, data, function(err, dbResponse) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(202).json(dbResponse);
    });
	});

	/**
	 * Delete a single user
	 */

	app.delete(api + '/:id', function(req, res) {
		UserModel.remove({
			'_id': req.params.id
		}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
	});

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