'use strict';

var mongoose = require('mongoose');

/**
 * Define a visit model
 */

var VisitSchema = mongoose.Schema({
    visitor_id: String,
    session_id: String,
		domain_id: String,
    host: String,
    referer: String,
    ip_address: String,
    user_agent: String,
    events: Array
});

module.exports = mongoose.model('Visit', VisitSchema);