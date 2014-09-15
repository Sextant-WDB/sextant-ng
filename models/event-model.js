'use strict';

var mongoose = require('mongoose');
var eventScheme = mongoose.Schema({
		url: String,
		eventType: String
	});

module.exports = mongoose.model('EventModel', eventScheme);
