angular.module('myApp')
    .controller('RegisterController', function ($scope, $http, crudService) {
        $scope.data = {};

        $scope.RegisterUser = function () {
            $http.post('/api/signup', $scope.User).then(function (response) {
                alert('User Registration Successful');
            });
        }
    });
