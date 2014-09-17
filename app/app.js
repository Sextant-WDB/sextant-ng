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
require('./services/http-service')(sextant);

// Models

// Controllers
require('./controllers/signin-controller')(sextant);
require('./controllers/data-controller')(sextant);

// Directives

// Routes
sextant.config([ '$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/data', {
			templateUrl: 'views/data-view.html',
			controller: 'dataController'
		})
		.when('/signin', {
      templateUrl: 'views/signin-view.html',
      controller: 'signInController'
    })
		.otherwise({
			redirectTo: '/data'
		});

		$locationProvider.html5Mode(true);
} ]);