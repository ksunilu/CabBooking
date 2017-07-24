angular.module('myApp')
    .controller('RegisterDriverController', function ($scope, $http, crudService) {

        function initData() {
            console.log('Trying get all data.');
            $scope.allData = [];
            $scope.Data = {};
            $scope.allTariffs = [];

            var promise = crudService.getAllData('/users');
            promise.then(function (data) {
                $scope.allData = data;
            });

            var promiseT = crudService.getAllData('/tariffs');
            promiseT.then(function (data) {
                $scope.allTariffs = data;
            });
        };
        initData();
        $scope.RegisterUser = function () {
            $scope.data.role = 'driver';

            var promise = crudService.addData($scope.data, '/users');
            promise.then(function (data) {
                initData();
            });
        }
    });
