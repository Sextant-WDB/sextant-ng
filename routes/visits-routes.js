'use strict';

var Visit = require('../models/visit-model');
var Domain = require('../models/domain-model');

/**
 * Read all visits to a given domain (authenticated)
 */

module.exports = function(app, jwtAuth) {

	app.get('/api/0_0_1/visits/:domainId', jwtAuth, function(req, res) {

	  // Grab the matching domain
	  Domain.find({
	    _id: req.params.domainId,
	    authorizedUsers: { $all: [ req.user._id ] }
	  }, function(err, domain) {

	    // Check for errors, and then grab all visits associated with the domain
	    if (err) return res.status(500).json(err);
	    if (domain.length > 1) {
	      return res.status(300).json({ 'msg': 'more than one domain' });
	    }
	    if (domain.length < 1) {
	      return res.status(204).json({ 'msg': 'no domains!' });
	    }

	    Visit.find({ domain_id: domain._id }, function(err, visits) {
	      if (err) return res.status(500).json(err);
	      return res.status(200).json(visits);
	    });

	  });
	});

};
