'use strict';
angular.module('myApp').factory('AuthenticationService', Service);

function Service($http, $cookies, $sessionStorage, $window) {
    var service = {};
    this.currentUser = undefined;

    service.Login = Login;
    service.Logout = Logout;
    service.GetUser = GetUser;
    service.UpdateLocation = UpdateLocation;
    return service;

    /*
        service.getLocation = getLocation;
        service.myLocation = myLocation;
        service.getLatLng = getLatLng;
    
        return service;
        function myLocation() {
            return $sessionStorage.location;
        }
        function getLatLng() {
            return { lat: $sessionStorage.lat, lng: $sessionStorage.lng };
        }
        function getLocation() {
            var loc = { lat: 28, lng: 77 };
            if ($window.navigator.geolocation) {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                    return loc;
                });
            }
        }
    */

    function addLocation2User(user) {
        
        var loc = { lat: 28, lng: 77 };
        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                user.Location = loc;
            });
        }
    }

    function Login(user, callback) {

        addLocation2User(user);
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
