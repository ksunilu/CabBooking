angular.module('myApp').directive('navbar', () => ({
    templateUrl: './views/nav.html',
    restrict: 'E',
    controller: 'NavBarController',
    controllerAs: 'nav'
}));
