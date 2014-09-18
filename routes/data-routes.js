'use strict';

var SessionModel = require('../models/session-model');

module.exports = function(app, jwtAuth) {

  var api = '/api/0_0_1/data';

  // CREATE
  app.post(api, function(req, res) {
    console.log('POST: ' + JSON.stringify(req.body));
    var newEvent = new SessionModel(req.body);
    newEvent.save(function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(dbResponse);
    });
  });

  //READ
  app.get(api, jwtAuth, function(req, res) {
    SessionModel.find({ sourceID: req.user.id }, function(err, dbResponse) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(dbResponse);
    });
  });

  // UPDATE
  app.put(api + '/:id', function(req, res) {
    var data = req.body;
    delete data._id;
    SessionModel.findOneAndUpdate({ '_id': req.params.id }, data, function(err, dbResponse) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(202).json(dbResponse);
    });
  });

  // DELETE
  app.delete(api + '/:id', function(req, res) {
    SessionModel.remove({ '_id': req.params.id }, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

  // DELETE ALL!!!1111
  app.get(api + '/deleteAll', function(req, res) {
    SessionModel.remove({}, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({
        'message': 'deleted'
      });
    });
  });

};