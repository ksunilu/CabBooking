angular.module('myApp')
    .controller('RegisterController', function ($scope, $http, crudService) {
        // function initData() {
        // console.log('Trying get all data.');
        // $scope.allData = {};
        // $scope.Data = {};
        // var promise = crudService.getAllData('/tariffs');
        // promise.then(function (data) {
        //     $scope.allData = data;
        // });
        // };
        // initData();
        $scope.RegisterUser = function () {
            $scope.data.role = 'client';
            var promise = crudService.addData($scope.data, '/users');
            promise.then(function (data) {
                if (data.sucess)
                    alert('user created');
                else
                    alert('user created');

                console.log(data);
            });
        }
    });
