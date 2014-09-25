'use strict';

module.exports = function(app) {
  app.directive('eventBarGraph', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/d3-events-bar-graph-template.html',
      controller: 'eventsBarGraphController'
    };
  });
};