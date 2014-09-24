'use strict';

var mongoose = require('mongoose');

/**
 * Define a visit model:
 *	-
 */

var VisitSchema = mongoose.Schema({
    visitor_id: String,
    session_id: String,
	domain_id: String,
    host: String,
    referer: String,
    ip_address: String,
    user_agent: String,
    events: [
      {
        nodeName: String,
        page: String,
        timeStamp: Date,
        type: String,
        innerHTML: String,
        classes: [{name:String}]
      }
    ]
	});

module.exports = mongoose.model('Visit', VisitSchema);
