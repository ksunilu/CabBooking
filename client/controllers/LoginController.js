angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location) {
        $scope.LoginUser = function () {
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === true) {
                    $location.path('/profile');
                }
            });
        };
    })
