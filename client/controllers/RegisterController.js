angular.module('myApp')
    .controller('RegisterController', function ($scope, $http, crudService) {

        $scope.RegisterUser = function () {
            $scope.data.role = 'client';
            var promise = crudService.addData($scope.data, '/users');
            promise.then(function (data) {
                if (data.sucess)
                    alert('user created');
                else
                    alert('user not created');

                console.log(data);
            });
        }
    });
