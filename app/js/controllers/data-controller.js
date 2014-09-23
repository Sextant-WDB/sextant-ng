'use strict';

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'HttpService', '$http', '$cookies',
		function($scope, HttpService, $http, $cookies) {

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
          .success(function(visits){
            $scope.visits = visits;
          });
      };
        
		} ]);
};