'use strict';

module.exports = function(app) {
	app.controller('headerController',
		[ '$scope', '$timeout', 'HttpService', '$cookies', '$location',
		function($scope, $timeout, HttpService, $cookies, $location) {

			/**
       * Show and hide the dropdown
       */

      $scope.hideNavDropdown = function() {
          if ($scope.dropdownHover === false) {
              $scope.navDropdown = false;
          }
      };

      $scope.closeNavDropdown = function() {
          $scope.dropdownHover = false;
          $timeout($scope.hideNavDropdown, 500);
      };

      $scope.openNavDropdown = function() {
          $scope.navDropdown = true;
          $scope.dropdownHover = true;
      };

      /**
       * Add the domain!
       */

      var domainService = new HttpService('domains');

      $scope.addDomain = function() {
        console.log('trying to post ' + $scope.newDomain);
        domainService.post($scope.newDomain, {});
        $scope.newDomain = '';
      };

      /**
       * Log out right from the nav
       */

      $scope.logOut = function() {
      	$cookies.jwt = null;
      	$location.path('/');
      };

		}
	]);
};