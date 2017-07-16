angular.module('myApp').controller('NavBarController',
    function ($rootScope, $scope, $location, AuthenticationService) {
        initData();

        function initData() {
            $rootScope.currentUser = AuthenticationService.GetUser();

        }

        $scope.LogoffUser = function () {
            AuthenticationService.Logout();
            $rootScope.currentUser = {};
            delete $rootScope.currentUser;

            $location.path('/');
        };

    });
