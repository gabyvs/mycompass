angular.module('compassApp').controller('wishes', [
    '$scope',
    'wishService',
    function ($scope, wishService) {
        wishService.getWishes().then(function (response){
            $scope.wishes = response.data;
        });

        $scope.newWish = '';
        $scope.addWish = function () {
            if (!$scope.newWish) return;
            wishService.addWish({ label: $scope.newWish }).then(function (response) {
                $scope.wishes.push(response.data);
            });
        };
    }]);