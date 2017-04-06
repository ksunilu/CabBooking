angular.module('myApp').controller('LoginController', function ($scope, $http) {
    $scope.LoginUser = function () {
        //sunil  change
        $http.put('/users/data/', $scope.User)
            .then(function (response) {
                console.log('Login Attempted');
                console.log('Login Response :' + response);
            });

    }
})
