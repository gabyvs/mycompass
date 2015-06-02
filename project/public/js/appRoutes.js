//angular.module('compassApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
angular.module('compassApp', ['ngRoute', 'ng-sortable', 'ui.bootstrap']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/config', {
            templateUrl: 'views/config.html',
            controller: 'config'
        })
        .when('/wishes', {
            templateUrl: 'views/wishes.html',
            controller: 'wishes'
        })
        .when('/board/:year/:quarter/:month/:week', {
            templateUrl: 'views/weekBoard.html',
            controller: 'weekBoard'
        })
        .when('/board/:year/:quarter/:month', {
            templateUrl: 'views/monthBoard.html',
            controller: 'monthBoard'
        })
        .when('/board/:year/:quarter', {
            templateUrl: 'views/quarterBoard.html',
            controller: 'quarterBoard'
        })
        .when('/board/:year', {
            templateUrl: 'views/yearBoard.html',
            controller: 'yearBoard'
        })
        .when('/board', {
            templateUrl: 'views/yearBoard.html',
            controller: 'yearBoard'
        })
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'main'
        })
        .otherwise({
            redirectTo: '/'
        })
    ;

    $locationProvider.html5Mode(true);

}]);