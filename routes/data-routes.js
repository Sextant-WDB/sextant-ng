'use strict';

var Visit = require('../models/visit-model');
// var Domain = require('../models/domain-model');

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
      console.log('slash in req.body.host!');
      req.body.host = req.body.host.slice(0, -1); // trim the last char
      console.log('new req.body.host: ' + req.body.host);
    }

    Visit.update({ 'sessionID' : req.body.sessionID }, { $pushAll: { events: req.body.events }}, function(err, records) {

      if(!records) {
        console.log('No records, creating new event');

        var newEvent = new Visit(req.body);
        newEvent.save(function(err, dbResponse) {
          if (err) return res.status(500).json(err);
          console.log('new visit saved');
          return res.status(200).json(dbResponse);
        });
      } else {
        console.log('Found visit and updated');
        return res.status(200).end();
      }
    });
  });

  /**
   * Update single piece of data
   */

  app.put(api + '/:id', function(req, res) {
    var data = req.body;
    delete data._id;
    Visit.findOneAndUpdate({ '_id': req.params.id }, data, function(err, dbResponse) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(202).json(dbResponse);
    });
  });

  /**
   * Delete single piece of data
   */

  app.delete(api + '/delete/:id', function(req, res) {
    Visit.remove({ '_id': req.params.id }, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

  /**
   * For development only: delete all data!!1111
   */

  app.delete(api + '/deleteAll', function(req, res) {
    Visit.remove({}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};
