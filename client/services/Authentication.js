'use strict';
angular.module('myApp').factory('AuthenticationService', Service);

function Service($http, $cookies, $sessionStorage) {
    var service = {};
    service.Login = Login;
    service.Logout = Logout;
    return service;

    function Login(user, callback) {
        user.statusTime = new Date();
        user.status = 'login';
        $http.put('/users/data/login', user)
            .then(function (response) {
                console.log(response.data);
                if (response.data.success && response.data.token) {
                    $sessionStorage.tokenDetails = { token: response.data.token };
                    $http.defaults.headers.common.Authorization = response.data.token;
                    var obj = { currentUser: { isLoggedIn: true, userInfo: response.data } };
                    $cookies.putObject('authUser', obj);
                    callback(response);
                } else {
                    callback(response);
                }
            });
    }

    function Logout() {
        var obj = $cookies.getObject('authUser');
        var user = obj.currentUser.userInfo.user;
        console.log(user);
        debugger;
        $http.put('/users/data/logoff', user)
            .then(function (response) {
                console.log('logout data ' + response.data);
            });
        delete $sessionStorage.tokenDetails;
        $http.defaults.headers.common.Authorization = '';
        $cookies.remove('authUser');
    }
    function GetUser() {
        var obj = $cookies.getObject('authUser');
        if (obj)
            return obj.currentUser.userInfo.user;
        else
            return null;
    }
}
