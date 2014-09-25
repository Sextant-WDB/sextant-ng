'use strict';

var Visit = require('../models/visit-model');
var Domain = require('../models/domain-model');

/**
 * Read all visits to a given domain (authenticated)
 */

module.exports = function(app, jwtAuth) {
	app.get('/api/0_0_1/visits/:domainId', jwtAuth, function(req, res) {
	  console.log('visits fired for ID ' + req.params.domainId);
	  Domain.findOne({
	    _id: req.params.domainId.toString(),
	    authorizedUsers: { $all: [ req.user._id ] }
	  }, function(err, domain) {
	  	console.log('found matching domain: ' + domain);
	    if (err) return res.status(500).json(err);
	    console.log('next, trying to match host: ' + domain.host);
	    Visit.find({ host: domain.host }, function(err, visits) {
	      console.log('visits: ' + visits);
	      if (err) return res.status(500).json(err);
	      else return res.status(200).json(visits);
	    });
	  });
	});
};
