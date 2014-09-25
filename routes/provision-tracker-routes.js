'use strict';

var VisitModel = require('../models/visit-model');
var Domains = require('../models/domain-model');
var crypto = require('crypto');
var uuid = require('node-uuid');

/**
 * API to provision credentials to tracked sites:
 *  - write keys
 *  - session IDs
 *  - unique user IDs
 */

module.exports = function(app, cors) {

    var api = '/api/0_0_1/provisionKeys';

    app.options(api, cors());

    var corsOptions = {
        methods: 'POST',
        maxAge: 300
    };

    // Request made by tracking script on initial page load
    app.post(api, cors(corsOptions), function(req, res) {

        // Origin header specifies the site where the events originated
        var origin = req.get('Origin');

        // Search the database for the domain making a request
        Domains.findOne({ host: origin }, function(err, dbResponse) {

            // Deny access if the domain isn't registered
            if(!dbResponse) {
                console.log('No dbResponse, returning 401');
                return res.status(401).end();
            }

            // Visit information to be saved
            var visitInfo = {};

            // Visit credentials to be sent back
            var visitCredentials = {};

            visitInfo.host = origin;
            visitInfo.referer = req.get('Referer');
            visitInfo.session_id = crypto.randomBytes(10).toString('hex').toUpperCase();
            visitInfo.ip_address = req.ip || req.ips;
            visitInfo.user_agent = req.get('User-Agent');

            if(!req.body.uniqueID) {
                visitInfo.visitor_id = uuid.v4().toUpperCase();
                visitCredentials.uniqueID = visitInfo.visitor_id;
            }

            // Create a new visit to track this visitors session
            var visit = new VisitModel(visitInfo);

            // Parse each event and append it to the visit
            req.body.events.forEach(function(event) {
                visit.events.push(event);
            });

            visit.save();

            visitCredentials.sessionID = visitInfo.session_id;
            visitCredentials.writeKey = dbResponse.write_key;

            return res.status(200).json(visitCredentials);
        });
    });
};