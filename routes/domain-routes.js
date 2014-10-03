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

  	// Standardize formatting: slash at the end of a URL is ignored
  	var domainName = req.params.domainName;
  	if (domainName.charAt(domainName.length - 1) === '/') {
  		domainName = domainName.slice(0, -1); // trim the last char
  	}
  	// Reject duplicates
  	Domain.find({
  		host: domainName
  	}, function(err, domains) {
  		if (err) return res.status(500).json(err);
  		if (domains.length > 0) return res.status(412).json({ 'msg': 'nice try!' });

	  	// If no duplicates, save new domain
	  	var newDomain = new Domain({
	  		host: domainName,
	  		authorizedUsers: [ req.user._id ],
	  		write_key: uuid.v4().toUpperCase()
	  	});
	  	newDomain.save();
	  	res.status(200).end();
  	});

  });

  /**
   * Delete all domains!!11 (for testing only)
   */

  app.delete(api, function(req, res) {
  	Domain.remove({}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};
