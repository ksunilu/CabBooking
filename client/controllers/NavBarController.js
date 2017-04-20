angular.module('myApp').controller('NavBarController',
    function ($scope, $http, AuthenticationService) {

        $scope.LogoffUser = function () {
            AuthenticationService.Logout();
            $location.path('/');
        };
    });
