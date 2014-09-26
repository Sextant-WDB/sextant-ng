'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('Session Controller', function() {
  var $controllerConstructor;
  var $httpBackend;
  var scope;

  beforeEach(angular.mock.module('sextant'));

  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  beforeEach(function() {
        this.sessionCtrl = $controllerConstructor('sessionController', { $scope: scope });
  });

  it('should able to create a new controller', function() {
    expect(typeof this.sessionCtrl).toBe('object');
  });

  it('should have a "logIn" method', function() {
    expect(scope.logIn).toBeDefined();
    expect(typeof scope.logIn).toBe('function');
  });

});