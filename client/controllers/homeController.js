angular.module('myApp').controller('HomeController',
  function ($scope, $http, crudService) {

    function initData() {
      console.log('Trying get all data.');
      $scope.allData = {};
      $scope.Data = {};

      var promise = crudService.getAllData('/tariffs');
      promise.then(function (data) {
        $scope.allData = data;
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
      debugger;
    };

  });
