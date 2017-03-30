
'use strict';
crudService.$inject = ['$http'];

function crudService($http) {
    var _this = this;
    _this.getAllData = function (routePath) {
        routePath = routePath.replace('/', '');
        return $http({
            method: 'GET',
            url: '/' + routePath + '/data',
        }).then(function (response) {
            console.log(response);
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    };

    _this.addData = function (record, routePath) {
        routePath = routePath.replace('/', '');
        //console.log($scope.theatre);
        return $http({
            method: 'POST',
            url: '/' + routePath + '/data',
            data: record

        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    };

    _this.deleteData = function (record, routePath) {
        routePath = routePath.replace('/', '');
        //console.log($scope.theatre);
        return $http({
            method: 'DELETE',
            url: '/' + routePath + '/data/' + record._id
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    };

    _this.getData = function (_id, routePath) {
        routePath = routePath.replace('/', '');
        return $http({
            method: 'GET',
            url: '/' + routePath + '/data/' + _id
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    };

    _this.updateData = function (record, routePath) {
        routePath = routePath.replace('/', '');
        return $http({
            method: 'PUT',
            url: '/' + routePath + '/data/' + record._id,
            data: record
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    };
}

app.service('crudService', crudService);


