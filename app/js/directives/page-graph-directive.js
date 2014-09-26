'use strict';

module.exports = function(app) {
  app.directive('pageGraph', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/page-graph-template.html',
      controller: 'pageGraphController'
    };
  });
};