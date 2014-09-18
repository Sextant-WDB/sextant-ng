'use strict';

/**
 * Allow CRUD interaction with the data API
 */

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'httpService', '$http', '$cookies', '$location',
		function($scope, httpService, $http, $cookies, $location) {

			$http.defaults.headers.common.jwt = $cookies.jwt;

	    /**
	     * Save new piece of (fake) data, for testing
	     */

			$scope.newData = {}; // Holds form data

	    $scope.saveNewData = function() {

	    	var today = new Date();
	    	$scope.newData.time = today.getHours() + ':' +
	    		today.getMinutes() + ':' +
	    		today.getSeconds();

	    	httpService.post($scope.newData)
	    	.success(function() {
	    		// Clear the form
		    	$scope.newData.url = '';
		    	$scope.newData.pageViews = '';
		    	$scope.newData.sourceID = '';
		    	document.activeElement.blur();
		    	// Grab the up-to-date data
	    		$scope.getAllData();
	    	});

	    };

			/**
			 * Grab all data from the db
			 */

			$scope.getAllData = function() {
	      httpService.get()
        .success(function(data) {
           $scope.data = data;
        });
	    };
	    $scope.getAllData(); // Invoke as soon as the controller loads

	    /**
	     * Update a piece of data
	     */

	    $scope.updateData = function(data) {
	    	data.editing = true;
	    };
	    $scope.saveOldData = function(data) {
	    	httpService.put(data)
        .success(function() {
          $scope.getAllData();
        });
	    };

	    /**
	     * Delete a piece of data
	     */

	    $scope.deleteData = function(data) {
	    	httpService.delete(data)
	    	.success(function() {
	    		$scope.getAllData();
	    	});
	    };

      /**
       * For dev only: delete all data
       */

      $scope.deleteAllData = function() {
        var confirmed = confirm('Are you sure?');
        if (!confirmed) {
          return false;
        }

        httpService.deleteAll()
        .success(function() {
          console.log('delete successful');
          $scope.getAllData();
        })
        .error(function(error) {
          console.log('error in delete: ' + JSON.stringify(error));
        });
      };

      /**
	     * Sign current user out
	     *
	     * (Note: this should eventually live in a different controller)
	     */

	    $scope.signOut = function() {
    		$cookies.jwt = null;
	    	$location.path('/'); // If redirect to /signin, error!
	    };

		} ]);
};