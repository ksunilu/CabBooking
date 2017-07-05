'use strict';
angular.module('myApp').factory('AuthenticationService', Service);

function Service($http, $cookies, $sessionStorage, $window) {
    var service = {};
    this.currentUser = undefined;

    service.Login = Login;
    service.Logout = Logout;
    service.GetUser = GetUser;
    service.getLocation = getLocation;
    service.UpdateLocation = UpdateLocation;

    return service;
    function getLocation() {
        // var location = new google.maps.LatLng(28.61, 77.23);
        var location = new google.maps.LatLng(0, 0);

        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            });
        }
        return location;
    }
    function Login(user, callback) {

        user.location = getLocation();
        user.statusTime = new Date();
        user.status = 'login';

        $http.put('/users/data/login', user)
            .then(function (response) {
                console.log(response.data);
                if (response.data.success && response.data.token) {
                    $sessionStorage.tokenDetails = { token: response.data.token };
                    $http.defaults.headers.common.Authorization = response.data.token;
                    var obj = { currentUser: { isLoggedIn: true, userInfo: response.data } };
                    //this.currentUser = obj.currentUser;

                    $cookies.putObject('authUser', obj);
                    callback(response);
                } else {
                    callback(response);
                }
            });
    }

    function Logout() {
        var obj = $cookies.getObject('authUser');
        if (obj) {
            var user = obj.currentUser.userInfo.user;
            console.log(user);
            // debugger;
            $http.put('/users/data/logoff', user)
                .then(function (response) {
                    console.log('logout data ' + response.data);
                });
            delete $sessionStorage.tokenDetails;
            $http.defaults.headers.common.Authorization = '';
            $cookies.remove('authUser');
        }

        //delete this.currentUser;
    }
    function GetUser() {
        var obj = $cookies.getObject('authUser');
        if (obj)
            return obj.currentUser.userInfo.user;
        else
            return null;
        //return this.currentUser;
    }
    function UpdateLocation(Location) {
        var currentUser = GetUser();
        console.log(currentUser);
        currentUser.Location = Location;
        return $http({
            method: 'PUT',
            url: '/users/data/' + currentUser._id,
            data: currentUser
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    }
}
