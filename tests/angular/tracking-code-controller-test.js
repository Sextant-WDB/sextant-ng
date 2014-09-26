'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('Tracking Code Controller', function() {
  var $controllerConstructor;
  var $httpBackend;
  var scope;

  beforeEach(angular.mock.module('sextant'));

  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  beforeEach(function() {
        this.trackingCodeCtrl = $controllerConstructor('trackingCodeController', { $scope: scope });
  });

  it('should able to create a new controller', function() {
    expect(typeof this.trackingCodeCtrl).toBe('object');
  });

  it('should have a scriptPath property', function() {
    expect(scope.scriptPath).toBeDefined();
    expect(typeof scope.scriptPath).toBe('string');
  });

  it('should have a "logIn" method', function() {
    expect(scope.continue).toBeDefined();
    expect(typeof scope.continue).toBe('function');
  });

  it('should generate a script path', function() {
    expect(scope.scriptPath.length).toBeGreaterThan(23);
  });
});