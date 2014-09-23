'use strict';

var mongoose = require('mongoose');

/**
 * Define a domain model
 */

var DomainSchema = mongoose.Schema({
  host : String,
  write_key: String,
  authorizedUsers: [
    {type:String}
  ]
});

module.exports = mongoose.model('Domain', DomainSchema);
