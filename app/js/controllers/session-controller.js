'use strict';

/**
 * Handle log-in and the creation of new accounts
 */

module.exports = function(app) {
  app.controller('sessionController', [
    '$scope', '$http', '$base64', '$cookies', '$location',
    function($scope, $http, $base64, $cookies, $location) {

      var api = '/api/0_0_1/users';

      /**
       * Log in existing users
       */

      $scope.logIn = function() {

        // Passport requires base-64 encoding
        $http.defaults.headers.common.Authorization = 'Basic ' +
        $base64.encode(
          $scope.user.email + ':' +
          $scope.user.password
        );

        $http.get(api)
        .success(function(data) {
          $cookies.jwt = data.jwt;
          $location.path('/dashboard');
        })
        .error(function(error) {
          console.log('error in session controller! ' + JSON.stringify(error));
        });

      };

      /**
       * Log out current user
       *
       */

      $scope.logOut = function() {
        $cookies.jwt = null;
        $location.path('/'); // If redirect to /signin, error!
      };

    }
  ]);
};