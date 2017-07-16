var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ngStorage']);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html'
        }).when('/book', {
            templateUrl: 'views/Book.html',
            controller: 'BookController'
        }).when('/tariffs', {
            templateUrl: 'views/tariffs.html',
            controller: 'TariffsController'
        }).when('/login', {
            templateUrl: 'views/Login.html',
            controller: 'LoginController'
        }).when('/register', {
            templateUrl: 'views/Register.html',
            controller: 'RegisterController'
        }).when('/register-driver', {
            templateUrl: 'views/RegisterDriver.html',
            controller: 'RegisterDriverController'
        }).when('/location', {
            templateUrl: 'views/Location.html',
            controller: 'LocationController'
        }).when('/rides', {
            templateUrl: 'views/rides.html',
            controller: 'RidesController'
        }).when('/password', {
            templateUrl: 'views/ChangePassword.html',
            controller: 'ChangePassword'
        })
        ;
});

app.run(function ($rootScope, $http, $location, $sessionStorage, $cookies, AuthenticationService) {
    $rootScope.currentUser = {};
    delete $rootScope.currentUser;

    if ($sessionStorage.tokenDetails) {
        $http.defaults.headers.common.Authorization = $sessionStorage.tokenDetails.token;


    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $rootScope.currentUser = AuthenticationService.GetUser();

        var publicPages = ['/', '/login', '/register'];

        var authUser = $cookies.getObject('authUser');
        if (authUser != undefined) {
            var loggedInUser = authUser.currentUser.userInfo;
        }
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$sessionStorage.tokenDetails && $location.path() != '') {
            $location.path('/login');
        }
        // console.log(restrictedPage);
        // console.log($sessionStorage.tokenDetails);
    });
});
