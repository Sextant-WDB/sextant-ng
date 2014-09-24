'use strict';

var d3 = require('d3');

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
            $scope.totalVisits = visits.length;
            d3init();
          });
      };

      $scope.$watch('visits', function(){
        $scope.totalVisits = $scope.visits ? $scope.visits.length : 0;
        d3update();
      });

      var d3init = function(){
        console.log('initializing d3');

      };

      var d3update = function(){
        console.log('updating d3');

         // calc the maximum events
        $scope.maxEvents = 0;
        $scope.visits.forEach(function(el){
          if( el.events.length > $scope.maxEvents){
            $scope.maxEvents = el.events.length;
          }
        });

        var height = 200;
        var barWidth = 20;
        var scale = d3.scale.linear()
          .domain([0, $scope.maxEvents])
          .range([height,0]);

        // initialize timeline
        $scope.timeline = d3.select('#d3-timeline')
          .attr('width', barWidth * $scope.visits.length)
          .attr('height', height);

        var bars = $scope.timeline.selectAll('g').data($scope.visits)
          .enter().append('g')
            .attr('transform', function(data, index){
              return 'translate(' + index * barWidth +',0)';
            });

        bars.append('rect')
          .attr('y', function(data){
            return scale(data.events.length);
          })
          .attr('width', barWidth - 1)
          .attr('height', function(data){
            return height - scale(data.events.length);
          });

        bars.append('text')
          .attr('x', barWidth / 2 )
          .attr('y', function() { 
            return height - 5; 
          })
          .attr('dy', '.35em')
          .text(function(data) { 
            return data.events.length; 
          });
      };
        
		} ]);
};