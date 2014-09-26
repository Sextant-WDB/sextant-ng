'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('Http Service', function() {
  var service;

  beforeEach(angular.mock.module('sextant'));

  beforeEach(angular.mock.inject(function(HttpService) {
     service = HttpService;
  }));


  it('should return a new HttpService instance', function() {
    expect(service).toBeDefined();
    expect(typeof service).toBe('function');
  });

  it('should have a get method', function() {
    expect(service.prototype.get).toBeDefined();
    expect(typeof service.prototype.get).toBe('function');
  });

  it('should have a put method', function() {
    expect(service.prototype.put).toBeDefined();
    expect(typeof service.prototype.put).toBe('function');
  });

  it('should have a post method', function() {
    expect(service.prototype.post).toBeDefined();
    expect(typeof service.prototype.post).toBe('function');
  });

  it('should have a delete method', function() {
    expect(service.prototype.delete).toBeDefined();
    expect(typeof service.prototype.delete).toBe('function');
  });
});