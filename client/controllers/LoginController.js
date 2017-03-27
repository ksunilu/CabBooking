angular.module('myApp').controller('LoginController', function($scope, $http) {
    $scope.LoginUser = function() {
        $http.post('/api/login', $scope.User).then(function(response) {});
        console.log('Login Attempted');
    }
})
