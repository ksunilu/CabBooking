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
        }).when('/error', {
            templateUrl: 'views/error.html'
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
        var user = $rootScope.currentUser = AuthenticationService.GetUser();

        var publicPages = ['/', '/login', '/register'];
        var webPages = ['/', '/book', '/tariffs', '/login', '/register', '/register-driver', '/location', '/rides', '/password'];

        var adminPages = ['/', '/login', '/password', '/tariffs', '/register-driver'];
        var driverPages = ['/', '/login', '/password', '/location'];
        var clientPages = ['/', '/login', '/register', '/password', '/rides', '/book'];



        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        var pageNotFound = webPages.indexOf($location.path()) === -1;

        var notDriverPage = driverPages.indexOf($location.path()) === -1 && $location.path() != '';
        var notAdminPage = adminPages.indexOf($location.path()) === -1 && $location.path() != '';
        var notClientPage = clientPages.indexOf($location.path()) === -1 && $location.path() != '';

        // var authUser = $cookies.getObject('authUser');
        // if (authUser != undefined) {
        //     var loggedInUser = authUser.currentUser.userInfo;
        // }


        if (restrictedPage && !$sessionStorage.tokenDetails && $location.path() != '') {
            $location.path('/login');
        }
        else if ($sessionStorage.tokenDetails) {
            if (pageNotFound && $location.path() != '') {
                //set global error
                alert('Error: Page not found')
                $location.path('/');
            }
            else if (user.role === 'admin' && notAdminPage ||
                user.role === 'driver' && notDriverPage ||
                user.role === 'client' && notClientPage) {
                //ill leagel page access
                alert('Error: Illegal page request!')
                $location.path('/');
            }
        }
        // console.log(restrictedPage);
        // console.log($sessionStorage.tokenDetails);

    });
});
