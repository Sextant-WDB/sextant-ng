'use strict';

module.exports = function(app) {
  app.controller('eventsBarGraphController', function($scope){
    var selection = '#d3-timeline';
    var defaultHeight = 200;
    var defaultWidth = 400;
    var maxEvents = 0;
    $scope.timeline = $scope.d3.select(selection);
    
    // handle redrawing the chart
    var invokeChart = function(){
      if( $scope.visits ){
        maxEvents = calcMaxEvents($scope.visits);
        var width = defaultWidth;
        var height = defaultHeight;
        chart(width, height);
      }
    };

    // calc the maximum events
    var calcMaxEvents = function(visits){
      var max = 0;
      visits.forEach(function(el){
        if(el.events.length > max){
          max = el.events.length;
        }
      });
      return max;
    };

    // listeners
    
    // $scope.$watch(function() {
    //   return document.getElementById('timeline-wrapper').offsetWidth;
    // }, function() {
    //   console.log('resize');
    //   invokeChart();
    // });
    
    $scope.$watch('visits', function(){
      $scope.totalVisits = $scope.visits ? $scope.visits.length : 0;
      if( $scope.visits ) invokeChart();
    });

  
    // chart
    var chart = function(width, height){

      var barWidth = width / $scope.visits.length;

      var scale = $scope.d3.scale.linear()
        .domain([0, maxEvents])
        .range([height,0]);

      // initialize timeline
      $scope.timeline = $scope.d3.select(selection)
        .attr('width', width)
        .attr('height', height);

      // create bars with data
      var bars = $scope.timeline.selectAll('g')
        .remove()
        .data($scope.visits)
        .enter().append('g')
          .attr('transform', function(data, index){
            return 'translate(' + index * barWidth +',0)';
          })
          .on('click', function(data){
            console.log(data);
          });

      // 
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

    }; // end chart

  });
};