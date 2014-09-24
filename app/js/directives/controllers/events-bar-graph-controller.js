'use strict';

module.exports = function(app) {
  app.controller('eventsBarGraphController', function($scope){

    $scope.$watch('visits', function(){
      $scope.totalVisits = $scope.visits ? $scope.visits.length : 0;
      if( $scope.visits ) graph();
    });

    var graph = function(){
       // calc the maximum events
      $scope.maxEvents = 0;
      $scope.visits.forEach(function(el){
        if( el.events.length > $scope.maxEvents){
          $scope.maxEvents = el.events.length;
        }
      });

      var height = 200;
      var barWidth = 20;
      var scale = $scope.d3.scale.linear()
        .domain([0, $scope.maxEvents])
        .range([height,0]);

      // initialize timeline
      $scope.timeline = $scope.d3.select('#d3-timeline')
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
  });
};