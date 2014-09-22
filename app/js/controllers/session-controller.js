'use strict';

/**
 * Handle sign-in and the creation of new accounts
 */

module.exports = function(app) {
  app.controller('sessionController', [
    '$scope', '$http', '$base64', '$cookies', '$location',
    function($scope, $http, $base64, $cookies, $location) {

      var api = '/api/0_0_1/users';

      /**
       * Sign in existing users
       */

      $scope.signIn = function() {

        // Passport requires base-64 encoding
        $http.defaults.headers.common.Authentication = 'Basic ' +
        $base64.encode(
          $scope.user.email + ':' +
          $scope.user.password
        );

        $http.get(api)
        .success(function(data) {
          $cookies.jwt = data.jwt;
          $location.path('/data');
        })
        .error(function(error) {
          console.log('error in signInController! ' + JSON.stringify(error));
        });

      };

      /**
       * Sign out current user
       *
       */

      $scope.signOut = function() {
        $cookies.jwt = null;
        $location.path('/'); // If redirect to /signin, error!
      };

    }
  ]);
};