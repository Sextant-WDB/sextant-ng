'use strict';

/**
 * Handle account operations: register, close account, update account...
 */

module.exports = function(app) {
  app.controller('accountController', [
    '$scope', '$http', '$base64', '$cookies', '$location',
    function($scope, $http, $base64, $cookies, $location) {

      var api = '/api/0_0_1/users';

      $scope.createNewUser = function() {
        $http.post(api, {
          'email': $scope.user.newEmail,
          'password': $scope.user.newPassword
        })
        .success(function(data) {
          $cookies.jwt = data.jwt;
          $location.path('/data');
          alert('Your ID is ' + data.id); // For dev only: find a better way
        })
        .error(function(error) {
          console.log('error in signInController! ' + JSON.stringify(error));
        });
      };

      /**
       * For dev only: delete all users
       */

      $scope.deleteAllUsers = function() {
        var confirmed = confirm('Are you sure?');
        if (!confirmed) {
          return false;
        }

        $http.delete(api)
        .success(function() {
          console.log('delete successful');
        })
        .error(function(error) {
          console.log('error in delete: ' + JSON.stringify(error));
        });
      };

    }
  ]);
};