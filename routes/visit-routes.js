'use strict';

var Visit = require('../models/visit-model');
var Domain = require('../models/domain-model');

module.exports = function(app, jwtAuth) {

	var api = '/api/0_0_1/visits';

	/**
	 * Read all visits to a given domain (authenticated)
	 */

	app.get(api + '/:domainId', jwtAuth, function(req, res) {
	  Domain.findOne({
	    _id: req.params.domainId.toString(),
	    authorizedUsers: { $all: [ req.user._id ] }
	  }, function(err, domain) {
	    if (err) return res.status(500).json(err);
	    Visit.find({ host: domain.host }, function(err, visits) {
	      if (err) return res.status(500).json(err);
	      else return res.status(200).json(visits);
	    });
	  });
	});


  /**
   * Delete all visits corresponding to a given domain (authenticated)
   */

  app.delete(api + '/:domainName(*)', jwtAuth, function(req, res) {
    console.log('delete fired with domain ' + req.params.domainName);
    Visit.remove({ host: req.params.domainName.toString() }, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};