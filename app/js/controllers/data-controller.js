'use strict';

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'HttpService', '$http', '$cookies', '$timeout',
		function($scope, HttpService, $http, $cookies, $timeout) {

			$http.defaults.headers.common.jwt = $cookies.jwt;

      $scope.d3 = require('d3');

      $scope.selectedDomain = false;

      var domainService = new HttpService('domains');

      $scope.getDomains = function(){
        domainService.get()
          .success(function(domains){
            $scope.domains = domains;
          });
      };

      $scope.domainSocket = io(); /* jshint ignore:line */

      $scope.domainSocket.on('newVisit', function() {
          console.log('newVisit event');
          //$scope.visits.push(visit);
          $scope.getVisits($scope.selectedDomain);
        });

      $scope.domainSocket.on('message', function(message) {
          console.log('Incoming message: %s', message);
        });

      $scope.getDomains(); // runs on view load

      var visitService = new HttpService('visits');

      $scope.getVisits = function(domain_id) {

        // Make a request to join the selected domains room
        $scope.domainSocket.emit('join', { jwt: $cookies.jwt, domainID: domain_id });

        $scope.selectedDomain = domain_id;

        visitService.get(domain_id.toString())
          .success(function(visits) {
            $scope.visits = visits;
            $scope.totalVisits = visits.length;
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