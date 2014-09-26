'use strict';

module.exports = function(app) {
	app.directive('sextantFooter', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/footer-template.html'
		};
	});
};