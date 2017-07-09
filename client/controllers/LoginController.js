angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location, $rootScope, $window) {
        $scope.LoginUser = function () {
            // $scope.user.status = login
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === true) {
                    console.log(response.data);
                    // debugger;
                    var socket = io();

                    //add location to user data  IMP edit
                    $window.navigator.geolocation.getCurrentPosition(function (position) {
                        loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                        response.data.user.location = loc;
                        socket.emit('logon', response.data.user);
                    });

                    socket.on('current users', function (loggedUsers) {
                        $rootScope.loggedUsers = loggedUsers;
                        $rootScope.currentUser = response.data.user;
                        console.log(loggedUsers);
                        debugger;
                    });

                    if (response.data.user.role === 'driver')
                        $location.path('/location');
                    else if (response.data.user.role === 'client')
                        $location.path('/book');
                    else if (response.data.user.role === 'admin')
                        $location.path('/tariffs');
                    else
                        $location.path('/');
                }
            });
        };
    })
