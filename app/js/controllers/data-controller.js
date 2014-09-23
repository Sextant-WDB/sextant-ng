'use strict';

/**
 * Allow CRUD interaction with the data API
 */

module.exports = function(app) {
	app.controller('dataController',
		[ '$scope', 'httpService', '$http', '$cookies',
		function($scope, httpService, $http, $cookies) {

			$http.defaults.headers.common.jwt = $cookies.jwt;

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
	     * Prepare a list of all the URLs present in a given user's dashboard
	     * No duplicates!
	     */

			// $scope.allSites = [];
			// $scope.sitesHash = {};

			// $scope.filterSites = function() {
			// 	$scope.sitesHash = {};
			// 	$scope.allSites = [];

			// 	for (var i = 0; i < $scope.data.length; i++) {
   //    		if (!$scope.sitesHash[$scope.data[i].url]) {
   //    			$scope.sitesHash[$scope.data[i].url] = true;
   //    			$scope.allSites.push($scope.data[i]);
   //    		}
   //    	}
			// };

			// $scope.show = function(site) {
			// 	$scope.console.log(site);
			// };

			/**
			 * Check if a given piece of data fits the user's sites to display
			 */

			$scope.isSelected = function(item) {
				$scope.allSites.forEach(function(site) {
					if (!site.use) {
						return false;
					}
					if (item.url === site.url) {
						return true;
					}
				});
			};

	    /**
	     * Update a piece of data
	     */

	    // $scope.updateData = function(data) {
	    // 	data.editing = true;
	    // };

	    // $scope.saveOldData = function(data) {
	    // 	httpService.put(data)
     //    .success(function() {
     //      $scope.getAllData();
     //    });
	    // };

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

      // $scope.$watch('data', function() {
      // 	// if (typeof data !== 'undefined')
	     //  	var sitesHash = {};
	     //  	$scope.allSites = [];

	     //  	for (var i = 0; i < $scope.data.length; i++) {
	     //  		if (!sitesHash[$scope.data[i].url]) {
	     //  			sitesHash[$scope.data[i].url] = true;
	     //  			$scope.allSites.push($scope.data[i]);
	     //  			console.log('site: ' + JSON.stringify($scope.data[i]));
	     //  		}
	     //  	}
	     //  // }
      // });

      // $scope.sites = [
	     //  'test.com',
	     //  'url.com',
	     //  'someUrl.com'
      // ];

		} ]);
};