angular.module('myApp').controller('RidesController',
  function ($scope, $http, crudService) {

    function initData() {
      console.log('Trying get all data.');
      $scope.allData = {};

      var promise = crudService.getAllData('/bookings');
      promise.then(function (res) {
        $scope.allData = res;

      });

    };
    initData();

    $scope.SaveData = function () {
      var promise = crudService.addData($scope.Data, '/tariffs');
      promise.then(function (data) {
        initData();
      });
    }

    $scope.DeleteData = function (model) {
      var promise = crudService.deleteData(model, '/tariffs');
      promise.then(function (data) {
        initData();
      });
    }

    $scope.UpdateData = function (model) {
      var promise = crudService.updateData(model, '/tariffs');
      promise.then(function (data) {
        initData();
      })
    }

    $scope.EditData = function (c) {
      $scope.Data = c;
      // debugger;
    };

  });
