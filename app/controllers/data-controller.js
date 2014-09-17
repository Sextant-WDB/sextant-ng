'use strict';

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'httpService', '$http', '$cookies', '$location',
		function($scope, httpService, $http, $cookies, $location) {

			$scope.newData = {};
			$scope.newData.dataBody = '';

			$http.defaults.headers.common.jwt = $cookies.jwt;

	    // Create
	    $scope.saveNewData = function() {
	    	var today = new Date();
	    	$scope.newData.time = today.getHours() + ':' +
	    		today.getMinutes() + ':' +
	    		today.getSeconds();
	    	httpService.post($scope.newData)
	    	.success(function() {
	    		$scope.getAllData();
	    	});
	    	// Reset the form
	    	$scope.newData.url = '';
	    	$scope.newData.pageViews = '';
	    };

			// Read
			$scope.getAllData = function() {
	      httpService.get()
        .success(function(data) {
           $scope.data = data;
        });
	    };
	    $scope.getAllData(); // Grab the data when the controller loads

	    // Update
	    $scope.updateData = function(data) {
	    	data.editing = true;
	    };
	    $scope.saveOldData = function(data) {
	    	httpService.put(data)
        .success(function() {
          $scope.getAllData();
        });
	    };

	    // Delete
	    $scope.deleteData = function(data) {
	    	httpService.delete(data)
	    	.success(function() {
	    		$scope.getAllData();
	    	});
	    };

	    // Sign out
	    $scope.signOut = function() {
	    	delete $cookies.jwt;
	    	$location.path('/signin');
	    };

		} ]);
};