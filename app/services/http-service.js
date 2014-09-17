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

		httpVerbs = {

			get: function() {
				return http('get', {});
			},

			post: function(data) {
				return http('post', {
					data: {
						url: data.url,
						pageViews: data.pageViews,
						time: data.time
					}
				});
			},

			put: function(data) {
				console.log('time: ' + data.time);
				return http('put', {
					data: {
						url: data.url,
						pageViews: data.pageViews,
						time: data.time
					},
					id: data._id
				});
			},

			delete: function(data) {
				return http('delete', {
					id: data._id
				});
			}

		};

		return httpVerbs;
	});
};