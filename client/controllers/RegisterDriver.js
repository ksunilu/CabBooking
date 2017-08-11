angular.module('myApp')
    .controller('RegisterDriverController', function ($scope, $http, crudService) {

        function initData() {
            console.log('Trying get all data.');
            $scope.allData = [];
            $scope.data = {};
            $scope.allTariffs = [];

            var promise = crudService.getAllData('/users');
            promise.then(function (data) {
                $scope.allData = data;
            });

            var promiseT = crudService.getAllData('/tariffs');
            promiseT.then(function (data) {
                $scope.allTariffs = data;
            });
        }

        initData();

        function userExist() {
            var email = $scope.data.email, all = $scope.allData, i;
            for (i = 0; i < all.length; i++) {
                if (email === all[i].email)
                    return true;
            }
            return false;
        }
        $scope.RegisterUser = function () {
            $scope.data.role = 'driver';
            if (userExist()) {
                alert("User Already exist's try a different email");
                return;
            }
            else {
                var promise = crudService.addData($scope.data, '/users');
                promise.then(function (data) {
                    initData();
                });
            }
        }

        //EditData(c)
        $scope.EditData = function (c) {
            // angular.copy(c, $scope.data);
            $scope.data = angular.copy(c);
        }
        // DeleteData(c)
        $scope.DeleteData = function (model) {
            var promise = crudService.deleteData(model, '/users');
            promise.then(function (data) {
                initData();
            });
        }

        $scope.UpdateData = function (model) {
            var promise = crudService.updateData(model, '/users');
            promise.then(function (data) {
                initData();
            })
        }

        $scope.ClearData = function () {
            $scope.data = {};
        }

    });
