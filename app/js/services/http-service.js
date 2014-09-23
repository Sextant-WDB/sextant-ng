'use strict';

/**
 * DRY out REST requests to the data API
 */

module.exports = function(app) {
	app.factory('HttpService', function($http, $location) {

		// Generic helper function
		var http = function(route, verb, id, data) {

			var getParameter = id ? '/' + id : '';
			var postData = data ? data : {};

			var url = '/api/0_0_1/' + route + getParameter;

			console.log('service url:' + url);

			var promise = $http[verb]( url , postData )
				.error(function(error, status) {
					if (status === 401) $location.path('/signin');
			});
			return promise;
		};

		var HttpService = function(url){
			this.url = url;
			console.log('service constructor called');
		};

		HttpService.prototype.get = function(id){
			return http( this.url, 'get', id);
		};

		HttpService.prototype.post = function(id, data){
			return http( this.url, 'post', id, data );
		};

		HttpService.prototype.put = function(id, data){
			return http( this.url, 'put', id, data );
		};
		HttpService.prototype.delete = function(id){
			return http( this.url, 'delete', id);
		};

		return HttpService;
	});
};