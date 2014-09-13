'use strict';

var fs = require('fs');

module.exports = function(app) {
  var api = '/api/0_0_1/data';

  app.get(api, function(req, res) {
    var data = fs.readFileSync('data.json', { encoding: 'utf-8' });
    return res.status(200).json(JSON.parse(data));
  });

  app.post(api, function(req, res) {
    fs.appendFileSync('data.json', JSON.stringify(req.body));
    return res.status(200).end();
  });

  app.get(api + '/reset', function(req, res) {
    fs.writeFileSync('data.json', '');
    return res.status(200).end();
  });
};

// curl -H "Content-Type: application/json" -d '{"post":"data"}' http://localhost:3000/api/0_0_1/data