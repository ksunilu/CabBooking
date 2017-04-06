angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location) {
        $scope.LoginUser = function () {
            AuthenticationService.Login($scope.User, function (response) {
                if (response.data.success === true) {
                    $location.path('/profile');
                }
            });
        };
    })
