angular.module('myApp')
    .controller('LoginController',
    function ($scope, $http, AuthenticationService, $location, $rootScope, $window) {
        $scope.LoginUser = function () {
            // $scope.user.status = login
            AuthenticationService.Login($scope.user, function (response) {
                if (response.data.success === false) {
                    alert('Sorry!! \n wrong user name / password');
                }
                if (response.data.success === true) {
                    console.log(response.data);
                    // debugger;
                    // var socket = io();
                    // socket.emit('logon', response.data.user);

                    // socket.on('current users', function (loggedUsers) {
                    //     $rootScope.loggedUsers = loggedUsers;
                    $rootScope.currentUser = response.data.user;
                    //     console.log('all users');
                    //     console.log(loggedUsers);
                    //     // debugger;
                    // });

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
