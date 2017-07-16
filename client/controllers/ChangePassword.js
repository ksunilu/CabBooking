angular.module('myApp')
    .controller('ChangePassword', function ($scope, $http, AuthenticationService) {
        function initData() {
            $scope.user = AuthenticationService.GetUser();

        };
        initData();

        $scope.SavePassword = function () {
            if ($scope.data.password === $scope.data.password)
                $scope.user
            //send data for change
            // if sucess show sucess
            // else pop error 


            //EVERY THING ENDS
            $location.path('/login');

            console.log($scope.user);
        }
    });
