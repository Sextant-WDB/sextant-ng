'use strict';

module.exports = function(app) {
	app.directive('sextantHeader', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/header-template.html'
		};
	});
};