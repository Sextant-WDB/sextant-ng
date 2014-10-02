'use strict';

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'HttpService', '$http', '$cookies', '$timeout',
		function($scope, HttpService, $http, $cookies, $timeout) {

			$http.defaults.headers.common.jwt = $cookies.jwt;

      $scope.d3 = require('d3');

      $scope.selectedDomain = false;

      var domainService = new HttpService('domains');

      /**
       * Load all domains matching the current user
       */

      $scope.getDomains = function(){
        domainService.get()
          .success(function(domains){
            $scope.domains = domains;
          });
      };

      $scope.getDomains(); // runs on view load

      /**
       * Load all visits matching a given domain
       */

      var visitService = new HttpService('visits');

      $scope.getVisits = function(domain_id, host) {

        $scope.selectedDomain = host;

        visitService.get(domain_id.toString())
          .success(function(visits) {
            $scope.visits = visits;
            $scope.totalVisits = visits.length;
          });
      };

      /**
       * Delete visits corresponding to a given domain
       */

      $scope.deleteVisits = function() {
        visitService.delete($scope.selectedDomain)
        .success(function() {
          $scope.getVisits($scope.selectedDomain);
        });
      };

      /**
       * Handle showing and hiding the domain dropdown
       */

      $scope.hideDropdown = function() {
          if ($scope.dropdownHover === false) {
              $scope.dropdown = false;
          }
      };

      $scope.closeDropdown = function() {
          $scope.dropdownHover = false;
          $timeout($scope.hideDropdown, 500);
      };

      $scope.openDropdown = function() {
          $scope.dropdown = true;
          $scope.dropdownHover = true;
      };

		} ]);
};