'use strict';

module.exports = function(app) {
  app.directive('visitDetails', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/visit-details-template.html'
    };
  });
};