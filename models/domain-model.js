'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

/**
 * Define a domain model:
 *  - 
 */

var domainScheme = mongoose.Schema({
  host : String,
  writeKey: {
    type: String,
    default: function(){
      return bcrypt.hashSync( moment().format() );
    }
  }
});

module.exports = mongoose.model('Domain', domainScheme);