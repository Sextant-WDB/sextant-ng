'use strict';

module.exports = function(app) {
  app.directive('visitSummary', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/visit-summary-template.html'
    };
  });
};