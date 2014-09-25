'use strict';

module.exports = function(app) {
	app.controller('trackingCodeController',
		[ '$scope', '$location',
		function($scope, $location) {

			var protocol = $location.protocol() + '://';
			var host = $location.host();
			var port = (host === 'localhost' ? ':' + $location.port() : '');
			var scriptUrl = protocol + host + port + '/public/sa-tracking.js';
			$scope.scriptPath = '<script src="' + scriptUrl + '"></script>';

			$scope.continue = function() {
				$location.path('/dashboard');
			};

		}
	]);
};