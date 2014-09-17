'use strict';

module.exports = function(app) {
  app.controller('signInController', [
    '$scope', '$http', '$base64', '$cookies', '$location',
    function($scope, $http, $base64, $cookies, $location) {

      var api = '/api/0_0_1/users';

      var oldCookies = $cookies.jwt; // testing

      $scope.signIn = function() {
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
          console.log('error in signInController! ' + error);
        });
      };

      $scope.createNewUser = function() {
        $http.post(api, {
          'email': $scope.user.newEmail,
          'password': $scope.user.newPassword,
          'url': $scope.user.newUrl
        })
        .success(function(data) {
          $cookies.jwt = data.jwt;
          $location.path('/data');
        })
        .error(function(error) {
          console.log('error in signInController! ' + error);
        });
      };

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