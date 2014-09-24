'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');


var sextant = angular.module('sextant', [
		'ngRoute',
		'base64',
		'ngCookies'
	]);

// Services
require('./js/services/http-service')(sextant);

// Models

// Controllers
require('./js/controllers/session-controller')(sextant);
require('./js/controllers/data-controller')(sextant);
require('./js/controllers/account-controller')(sextant);

// Directives

// Routes
sextant.config([ '$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'views/gateway-view.html',
				controller: 'sessionController'
			})
			.when('/dashboard', {
				templateUrl: 'views/dashboard-view.html',
				controller: 'dataController'
			})
			.otherwise({
				redirectTo: '/login'
			});


		// $locationProvider.html5Mode(true);
} ]);