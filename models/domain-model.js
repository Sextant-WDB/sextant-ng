'use strict';

var mongoose = require('mongoose');

/**
 * Define a domain model
 */

var DomainSchema = mongoose.Schema({
  host : String,
  write_key: String,
  authorizedUsers: Array // Of db-generated IDs
});

module.exports = mongoose.model('Domain', DomainSchema);
