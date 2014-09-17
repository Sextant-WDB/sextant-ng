'use strict';

module.exports = function(app) {
	app.factory('httpService', function($http, $location) {

		// Generic helper function
		var http = function(method, params) {

			params.id = params.id || '';

			var promise = $http[method]('/api/0_0_1/data/' + params.id, params.data)
			.error(function(error, status) {

				console.log('Error in http ' + method + ': ' + error + ' | status ' + status);
				if (status === 401) {
					console.log('401 error in httpService!');
					$location.path('/signin');
				}

			});

			return promise;
		},

		// Specific verbs
		httpVerbs = {

			get: function() {
				return http('get', {});
			},

			post: function(data) {
				console.log('data: ' + JSON.stringify(data));
				return http('post', data);
			},

			put: function(data) {
				return http('put', data);
			},

			delete: function(data) {
				return http('delete', data);
			}

		};

		return httpVerbs;
	});
};