'use strict';

var EventModel = require('../models/event-model');

var fs = require('fs');

module.exports = function(app) {
  var api = '/api/0_0_1/data';

  app.get(api, function(req, res) {
    EventModel.find({}, function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(dbResponse);
    });
  });

  app.post(api, function(req, res) {
    var newEvent = new EventModel(req.body);
    newEvent.save(function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(dbResponse);
    });
  });

  app.get(api + '/reset', function(req, res) {
    fs.writeFileSync('data.json', '');
    return res.status(200).end();
  });
};

// curl -H "Content-Type: application/json" -d '{"post":"data"}' http://localhost:3000/api/0_0_1/data