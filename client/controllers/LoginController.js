angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location, $rootScope) {
        $scope.LoginUser = function () {
            // $scope.user.status = login
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === true) {
                    console.log(response.data);
                    // debugger;
                    var socket = io();

                    //add location to user data  IMP edit

                    socket.emit('logon', response.data.user);
                    socket.on('current users', function (loggedUsers) {
                        // console.log(loggedUsers);
                        // console.log(response.data.user);

                        $rootScope.loggedUsers = loggedUsers;
                        $rootScope.currentUser = response.data.user;
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
