'use strict';

module.exports = function(app) {
  app.controller('eventsBarGraphController', function($scope){

    var selection = '#d3-timeline';
    var maxEvents = 0;

    var invokeChart = function(){
      if( $scope.visits ){
        maxEvents = calcMaxEvents($scope.visits);
        var width = $scope.d3.select(selection).node().parentNode.offsetWidth;
        console.log(width);
        chart(selection, width)();
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

    $scope.$watch('visits', function(){
      $scope.totalVisits = $scope.visits ? $scope.visits.length : 0;
      if( $scope.visits ) invokeChart();
    });

    window.onresize = function() { /*jshint ignore: line*/
      $scope.$apply();
    };

    // $scope.$watch(function() {
    //   return angular.element(window)[0].innerWidth; jshint ignore: line
    // }, function() {
    //   console.log('resize');
    //   invokeChart();
    // });

    $scope.d3.select(window).on('resize', myChart()()); 

    // chart
    var chart = function(selection, elWidth){

      var height = 200;
      var width = elWidth;

      var myChart = function(){

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
      };

      return myChart;
    };

      

  });
};