'use strict';

var Visit = require('../models/visit-model');

/**
 * API endpoints to read from the database and inject new data
 */

module.exports = function(app, cors) {

  var api = '/api/0_0_1/data';

  app.options(api, cors());

  var corsOptions = {
    methods: 'POST',
    maxAge: 300
  };

  /**
   * Create single new data event
   */

  app.post(api, cors(corsOptions), function(req, res) {


    req.body.host = req.get('Origin');

    if (req.body.host && req.body.host.charAt(req.body.host.length - 1) === '/') {
      req.body.host = req.body.host.slice(0, -1); // trim the last char
    }

    Visit.update({ 'session_id' : req.body.sessionID }, { $pushAll: { events: req.body.events }}, function(err, records) {

      if(!records) {

        var newEvent = new Visit(req.body);
        newEvent.save(function(err, dbResponse) {
          if (err) return res.status(500).json(err);
          return res.status(200).json(dbResponse);
        });
      } else {
        return res.status(200).end();
      }
    });
  });

};