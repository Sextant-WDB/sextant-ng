'use strict';

var VisitModel = require('../models/visit-model');
var Domains = require('../models/domain-model');
var crypto = require('crypto');
var uuid = require('node-uuid');

/**
 * API endpoints to create new users and log in existing ones
 */

module.exports = function(app, cors) {

    var api = '/api/0_0_1/provisionKeys';

    app.options(api, cors());

    var corsOptions = {
        methods: 'POST',
        maxAge: 300
    };

    app.post(api, cors(corsOptions), function(req, res) {
        var origin = req.get('Origin');

        Domains.find({ host: origin }, function(err, dbResponse) {
            var attributes = {};
            var visitorInfo = {};

            attributes.host = req.get('Host');
            attributes.referer = req.get('Referer');
            attributes.session_id = crypto.randomBytes(10).toString('hex').toUpperCase();
            attributes.ip_address = req.ip || req.ips;
            attributes.user_agent = req.get('User-Agent');

            if(!req.body.uniqueID) {
                attributes.visitor_id = uuid.v4().toUpperCase();
                visitorInfo.uniqueID = attributes.visitor_id;
            }

            var visit = new VisitModel(attributes);
            visit.events.push(req.body);
            visit.save();

            visitorInfo.sessionID = attributes.session_id;
            visitorInfo.writeKey = dbResponse.writeKey;

            return res.status(200).json(visitorInfo);
        });
    });
};