'use strict';

module.exports = function(app) {
  app.controller('eventsBarGraphController', function($scope){
    var selection = '#d3-timeline';
    var chartWidth = 400;
    var chartHeight = 200;
    var maxEvents = 0;
    $scope.timeline = $scope.d3.select(selection);

    // handle redrawing the chart
    var invokeChart = function(pageEvents){
      if( pageEvents ){
        maxEvents = calcMaxEvents($scope.visits);
        chart(pageEvents, chartWidth, chartHeight);
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

    $scope.$watch('visits', function() {
      console.log('change noticed from bar graph');
      $scope.totalVisits = $scope.visits ? $scope.visits.length : 0;

      if( $scope.visits ) {

        // $scope.totalVisits gives us too many visits, because it includes not only
        // page changes but also clicks, scrolls, etc. We need to filter down to only
        // loads and route changes.

        var pageEvents = []; // The parent array, which holds sessions
        $scope.visits.forEach(function(visit) {

          // Filter out irrelevant visit data
          var sessionEvents = visit.events.filter(function(event) {
            return event.eventType === 'pageLoad' || event.eventType === 'pageChange';
          });
          pageEvents.push(sessionEvents);

        });

        invokeChart(pageEvents);
      }
    });

    // chart
    var chart = function(pageEvents, width, height){

      var barWidth = width / pageEvents.length;


      var scale = $scope.d3.scale.linear()
        .domain([0, maxEvents])
        .range([height,0]);

      // initialize timeline
      $scope.timeline = $scope.d3.select(selection)
        .attr('width', width)
        .attr('height', height);

      // create bars with data
      $scope.timeline.selectAll('g').remove(); // Note: needs to be outside `var bars...`

      var bars = $scope.timeline.selectAll('g') // Selects columns
        .data(pageEvents)
        .enter().append('g')
          .attr('transform', function(data, index) {
            return 'translate(' + index * barWidth +',0)';
          })
          .on('click', function(data){
            console.log(data);
          });

      bars.append('rect')
        .attr('y', function(data){
          return scale(data.length);
        })
        .attr('width', barWidth - 1)
        .attr('height', function(data){
          return height - scale(data.length);
        });

      bars.append('text')
        .attr('x', barWidth / 2 )
        .attr('y', function() {
          return height - 5;
        })
        .attr('dy', '.35em')
        .text(function(data) {
          return data.length;
        });

    }; // end chart

  });
};