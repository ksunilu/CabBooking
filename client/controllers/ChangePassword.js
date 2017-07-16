angular.module('myApp')
    .controller('ChangePassword', function ($scope, $location, $http, AuthenticationService) {
        $scope.SavePassword = function () {
            if ($scope.data.newpassword !== $scope.data.cnfpassword) {
                alert("New password and Confirm password don't match\nTry Again!!");

            }
            else {

                var promise = AuthenticationService.UpdatePassword($scope.data);
                promise.then(function (data) {
                    if (data.sucess) alert('password changed');
                    else alert(data.message);
                    console.log(data);
                });
            }
            $location.path('/login');
        }
    });
