'use strict';

/**
 * DRY out REST requests to the data API
 */

module.exports = function(app) {
	app.factory('httpService', function($http, $location) {

		// Generic helper function
		var http = function(method, params) {

			params.id = params.id || '';

			var promise = $http[method]('/api/0_0_1/data/' + params.id, params.data)
			.error(function(error, status) {

				console.log('Error in http ' + method + ': ' + error + ' | status ' + status);
				if (status === 401) {
					$location.path('/signin');
				}

			});

			return promise;
		};

		// Specific verbs
		var httpVerbs = {

			get: function() {
				return http('get', {});
			},

			post: function(data) {
				return http('post', {
					data: data
				});
			},

			put: function(data) {
				return http('put', {
					data: data,
					id: data._id
				});
			},

			delete: function(data) {
				return http('delete', {
					id: 'delete/' + data._id
				});
			},

			// Dev only
			deleteAll: function() {
				return http('delete', {
					id: 'deleteAll'
				});
			}

		};

		return httpVerbs;
	});
};