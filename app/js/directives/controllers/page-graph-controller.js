'use strict';

module.exports = function(app) {
  app.controller('pageGraphController', function($scope){

    $scope.$watch('visits', function(){
      if( $scope.visits ) parseGraphData();
    });

    var parseGraphData = function(){

    };



  });
};