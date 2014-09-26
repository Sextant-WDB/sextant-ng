'use strict';

module.exports = function(app) {
  app.directive('visitSummary', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/visit-summary-template.html',
      controller: function($scope){
        $scope.$watch('visits', function(){
          if( $scope.visits ){
            var bounces = 0;
            $scope.visits.forEach(function(el){
              if( el.events.length === 1 ) bounces ++;
            });
            $scope.bounceRate = (bounces / $scope.visits.length * 100).toFixed(1);
            if ($scope.bounceRate === 'NaN') {
              $scope.bounceRate = 0;
            }
          }
        });
      }
    };
  });
};