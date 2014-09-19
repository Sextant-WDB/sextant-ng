'use strict';

var mongoose = require('mongoose');

/**
 * Define minimal tracking metrics--for now:
 *	- url where the action happened
 *	- # pageviews
 *	- time (of what?)
 *	- most importantly, `sourceID`: will be set automatically on the user's end
 */

var sessionScheme = mongoose.Schema({
		url: String,
		pageViews: Number,
		time: String,
		sourceID: String,
		event: Object
	});

module.exports = mongoose.model('SessionModel', sessionScheme);