angular.module('compassApp').controller('main', [
    '$scope',
    '$location',
    function($scope, $location) {
        $scope.tagline = 'Organizing your life once forever.';
        $scope.tab = $location.path().split('/')[1];
    }
]);