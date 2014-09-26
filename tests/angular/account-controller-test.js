'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('Account Controller', function() {
  var $controllerConstructor;
  var $httpBackend;
  var scope;

  beforeEach(angular.mock.module('sextant'));

  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  beforeEach(function() {
        this.accountCtrl = $controllerConstructor('accountController', { $scope: scope });
  });

  it('should able to create a new controller', function() {
    expect(typeof this.accountCtrl).toBe('object');
  });

  it('should have a "createNewUser" method', function() {
    expect(scope.createNewUser).toBeDefined();
    expect(typeof scope.createNewUser).toBe('function');
  });

});