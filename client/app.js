var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/Home.html',
            controller: 'HomeController'
        })
        .when('/tariffs', {
            templateUrl: 'views/tariffs.html',
            controller: 'TariffsController'
        })
        .when('/login', {
            templateUrl: 'views/Login.html',
            controller: 'LoginController'
        }).when('/register', {
            templateUrl: 'views/Register.html',
            controller: 'RegisterController'
        }).when('/register-driver', {
            templateUrl: 'views/RegisterDriver.html',
            controller: 'RegisterDriverController'
        }).when('/profile', {
            templateUrl: 'views/Profile.html',
            resolve: {
                logincheck: checkLoggedIn
            }
        });
});

var checkLoggedIn = function ($q, $http, $location, $rootScope) {
    var deferred = $q.defer();
    $http.get('/api/loggedin').then(function (user) {
        if (user.data != '0') {
            $rootScope.currentUser = user.data;
            deferred.resolve();
            console.log('User Logged in');
        } else {
            deferred.reject();
            $location.url('/login');
            console.log('User is not logged in');
        }
    });
    return deferred.promise;
}
