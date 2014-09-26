'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('Data Controller', function() {
  var $controllerConstructor;
  var $httpBackend;
  var scope;

  beforeEach(angular.mock.module('sextant'));

  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  beforeEach(function() {
        this.dataCtrl = $controllerConstructor('dataController', { $scope: scope });
  });

  it('should able to create a new controller', function() {
    expect(typeof this.dataCtrl).toBe('object');
  });

  it('should have a "getDomains" method', function() {
    expect(scope.getDomains).toBeDefined();
    expect(typeof scope.getDomains).toBe('function');
  });

  it('should have a "getVisits" method', function() {
    expect(scope.getVisits).toBeDefined();
    expect(typeof scope.getVisits).toBe('function');
  });

  it('should have a "hideDropdown" method', function() {
    expect(scope.hideDropdown).toBeDefined();
    expect(typeof scope.hideDropdown).toBe('function');
  });

  it('should have a "closeDropdown" method', function() {
    expect(scope.closeDropdown).toBeDefined();
    expect(typeof scope.closeDropdown).toBe('function');
  });

  it('should have a "openDropdown" method', function() {
    expect(scope.openDropdown).toBeDefined();
    expect(typeof scope.openDropdown).toBe('function');
  });

  it('should require D3', function() {
    expect(scope.d3).toBeDefined();
    expect(typeof scope.openDropdown).toBe('function');
  });
});