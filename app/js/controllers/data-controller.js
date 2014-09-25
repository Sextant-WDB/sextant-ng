'use strict';

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'HttpService', '$http', '$cookies', '$timeout',
		function($scope, HttpService, $http, $cookies, $timeout) {

			$http.defaults.headers.common.jwt = $cookies.jwt;

      $scope.selectedDomain = false;

      var domainService = new HttpService('domains');

      $scope.getDomains = function(){
        domainService.get()
          .success(function(domains){
            $scope.domains = domains;
          });
      };

      $scope.getDomains(); // run on view load

      var visitService = new HttpService('visits');

      $scope.getVisits = function(domain_id){

        $scope.selectedDomain = domain_id;

        visitService.get(domain_id.toString())
          .success(function(visits) {
            $scope.visits = visits;
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
          $timeout($scope.hideDropdown, 1000);
      };

      $scope.openDropdown = function() {
          $scope.dropdown = true;
          $scope.dropdownHover = true;
      };

      /**
       * Add domains
       */

      $scope.addDomain = function() {
        console.log('function fired!');
        domainService.post($scope.newDomain, {});
        $scope.newDomain = '';
      };

		} ]);
};