'use strict';

/**
 * Handle account operations: register, close account, update account...
 */

module.exports = function(app) {
  app.controller('accountController', [
    '$scope', '$http', '$base64', '$cookies', '$location', 'HttpService',
    function($scope, $http, $base64, $cookies, $location, HttpService) {

      var api = '/api/0_0_1/users';

      var domainService = new HttpService('domains');

      $scope.createNewUser = function() {
        $http.post(api, {
          'email': $scope.user.newEmail,
          'password': $scope.user.newPassword
        })
        .success(function(data) {
          // Set cookies right away!
          $cookies.jwt = data.jwt;
          $http.defaults.headers.common.jwt = data.jwt;
          domainService.post($scope.user.newDomain, {});
          $scope.user.newDomain = '';
          $location.path('/init');
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

      /**
       * Add a new domain
       */

      // $scope.addDomain = function() {
      //   console.log('trying to post ' + $scope.newDomain);
      //   domainService.post($scope.newDomain, {});
      //   $scope.newDomain = '';
      // };

    }
  ]);
};