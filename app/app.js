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
require('./controllers/init-controller')(sextant);

// Directives

// Routes
sextant.config([ '$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			controller: 'init-controller',
			templateUrl: 'views/init-view.html'
		})
		// .when('/signin', {
  //     templateUrl: 'views/signInView.html',
  //     controller: 'signInController'
  //   })
		// .otherwise({
		// 	redirectTo: '/links'
		// });
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
} ]);