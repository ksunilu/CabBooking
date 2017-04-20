angular.module('myApp').controller('NavBarController',
    function ($scope, $location, AuthenticationService) {
        $scope.LogoffUser = function () {
            AuthenticationService.Logout();
            $location.path('/');
        };
    });
