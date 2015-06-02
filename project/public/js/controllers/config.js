angular.module('compassApp').controller('config', [
    '$scope',
    'configService',
    function ($scope, configService) {
         configService.getPeriods().then(function (response){
             $scope.periods = response.data;
         });
}]);