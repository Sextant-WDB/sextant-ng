'use strict';

var VisitModel = require('../models/visit-model');
var Domains = require('../models/domain-model');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

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
            var response = {};

            attributes.host = req.get('Host');
            attributes.referer = req.get('Referer');
            attributes.session_id = bcrypt.hashSync(crypto.randomBytes(16).toString('base64'));
            attributes.ip_address = req.ip || req.ips;
            attributes.user_agent = req.get('User-Agent');

            if(!req.body.uuid) {
                attributes.uniqueVisitorID = bcrypt.hashSync(crypto.randomBytes(16).toString('base64'));
                response.uuid = attributes.uniqueVisitorID;
            }

            var visit = new VisitModel(attributes);
            visit.events.push(req.body);
            visit.save();

            response.usid = attributes.session_id;
            response.writeKey = dbResponse.writeKey;

            return res.status(200).json(response);
        });
    });
};