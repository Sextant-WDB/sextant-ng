'use strict';

var moment = require('moment');
var _ = require('underscore');

module.exports = function(app) {
  app.directive('visitSummary', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/visit-summary-template.html',
      controller: function($scope){

        $scope.$watch('visits', function(){
          if( $scope.visits ){
            $scope.bounceRate = getBounceRate($scope.visits);
            $scope.avgDuration = getAvgDuration($scope.visits);
          }
        });

        var getBounceRate = function(visits){
          var bounces = 0;
          var bounceRate = 0;
          visits.forEach(function(visit){
            if( visit.events.length === 1 ) bounces ++;
          });
          bounceRate = (bounces / $scope.visits.length * 100).toFixed(1);
          if (bounceRate === 'NaN') bounceRate = 0;
          return bounceRate;
        };

        var getAvgDuration = function(visits){
          var durations = [];
          var avg = 0;

          visits.forEach(function(visit){
            if(visit.events.length > 1){
              var start, end;
              start = moment(visit.events[0].timeStamp);
              end = moment(visit.events[visit.events.length-1].timeStamp);
              durations.push(end.diff(start));
            }
          });

          if( durations.length > 0){
            avg = _.reduce(durations) / durations.length;
          } else {
            avg = 0;
          }

          return moment.duration(avg).humanize();
        };

      }
    };
  });
};