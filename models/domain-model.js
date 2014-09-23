'use strict';

var mongoose = require('mongoose');

/**
 * Define a domain model:
 */

var DomainSchema = mongoose.Schema({
  host : String,
  writeKey: String
});

module.exports = mongoose.model('Domain', DomainSchema);
