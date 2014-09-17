'use strict';

var mongoose = require('mongoose');
var sessionScheme = mongoose.Schema({
		url: String,
		pageViews: Number,
		time: String
	});

module.exports = mongoose.model('SessionModel', sessionScheme);
