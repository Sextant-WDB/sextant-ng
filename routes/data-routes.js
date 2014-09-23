'use strict';

var VisitModel = require('../models/visit-model');

/**
 * API endpoints to read from the database and inject new data
 */

module.exports = function(app, jwtAuth, cors) {

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

    // console.log('POST recorded: ' + JSON.stringify(req.body));

    var newEvent = new VisitModel(req.body);
    newEvent.save(function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(dbResponse);
    });
  });

  /**
   * Read all data (authenticated)
   */

  /**
   * Goal: return only that data that matches the logged-in user
   *
   * To do:
   *  -
   *  -
   *  -
   *  -
   *  -
   */

  app.get(api, jwtAuth, function(req, res) {
    VisitModel.find({}, function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      console.log(req.user.basic.email);
      return res.status(200).json(dbResponse);
    });
  });

  /**
   * Update single piece of data
   */

  app.put(api + '/:id', function(req, res) {
    var data = req.body;
    delete data._id;
    VisitModel.findOneAndUpdate({ '_id': req.params.id }, data, function(err, dbResponse) {
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
    VisitModel.remove({ '_id': req.params.id }, function(err) {
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
    VisitModel.remove({}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};