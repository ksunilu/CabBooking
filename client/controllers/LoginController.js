angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location) {
        $scope.LoginUser = function () {
            // $scope.user.status = login
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === true) {
                    console.log(response.data);
                    debugger;
                    $location.path('/rides');
                }
            });
        };
    })
