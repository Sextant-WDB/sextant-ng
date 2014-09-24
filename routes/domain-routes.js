'use strict';

var Domain = require('../models/domain-model');
var uuid = require('node-uuid');

/**
 * Read all authorized domains for the logged-in user
 */

module.exports = function(app, jwtAuth) {

  var api = '/api/0_0_1/domains';

  app.get(api, jwtAuth, function(req, res) {
    Domain.find({
      authorizedUsers: { $all: [ req.user._id ] }
    }, function(err, domains) {
      if (err) return res.status(500).json(err);
      else return res.status(200).json(domains);
    });

  });


  /**
   * Let a user add new domains
   */

  app.post(api + '/:domainName(*)', jwtAuth, function(req, res) {

  	// Reject duplicates
  	Domain.find({
  		host: req.params.domainName
  	}, function(err, domains) {
  		if (err) return res.status(500).json(err);
  		if (domains.length > 0) return res.status(412).json({ 'msg': 'nice try!' });

	  	// If no duplicates, save new domain
	  	var newDomain = new Domain({
	  		host: req.params.domainName,
	  		authorizedUsers: [ req.user._id ],
	  		write_key: uuid.v4().toUpperCase()
	  	});
	  	newDomain.save();
	  	res.status(200).end();
  	});

  });

};
