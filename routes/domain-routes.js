'use strict';

var Domain = require('../models/domain-model');

/**
 * Read all authorized domains for the logged-in user
 */

module.exports = function(app, jwtAuth) {

  app.get('/api/0_0_1/domains', jwtAuth, function(req, res) {
    Domain.find({ 
      authorizedUsers: { $all: [ req.user._id ] } 
    }, function(err, domains) {
      if (err) return res.status(500).json(err);
      else return res.status(200).json(domains);
    });

  });

};
