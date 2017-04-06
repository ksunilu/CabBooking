angular.module('myApp').controller('LoginController', function ($scope, $http) {
    $scope.LoginUser = function () {
        //sunil  change
        $http.post('/users/data/login', $scope.User).then(function (response) {
            console.log('Login Attempted');
            console.log('Login Response :' + response);
        });

    }
})
