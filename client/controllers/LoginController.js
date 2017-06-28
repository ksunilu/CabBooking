angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location) {
        $scope.LoginUser = function () {
            // $scope.user.status = login
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === true) {
                    console.log(response.data);
                    // debugger;
                    if (response.data.user.role === 'driver')
                        $location.path('/location');
                    else if (response.data.user.role === 'client')
                        $location.path('/book');
                    else if (response.data.user.role === 'admin')
                        $location.path('/tariffs');
                    else
                        $location.path('/');
                }
            });
        };
    })
