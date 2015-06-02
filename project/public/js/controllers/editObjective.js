angular.module('compassApp').controller('editObjective', [
    '$scope',
    '$modalInstance',
    'objective',
    'objectives',
    'wishService',
    function ($scope, $modalInstance, objective, objectives, wishService) {

        $scope.objective = objective;
        $scope.objectives = objectives;
        $scope.statusOptions = [
            { status: 'new', label: 'New' },
            { status: 'started', label: 'Started' },
            { status: 'closed', label: 'Finished' }
        ];

        $scope.categoryOptions = [
            { value: 'home', label: 'Home' },
            { value: 'work', label: 'Work' },
            { value: 'nena', label: 'Nena' }
        ];

        $scope.save = function () {
            wishService.makeAWish($scope.objective).then(function () {
                $modalInstance.close($scope.objective);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.delete = function () {
            wishService.deleteWish($scope.objective).then(function () {
                $modalInstance.close('deleted');
            });
        };

        $scope.addActivity = function () {
            if (!$scope.newActivity) { return; }
            wishService.addActivity($scope.newActivity, $scope.objective).then(function (response) {
                $scope.activities.push(response.data);
                $scope.objectives.push(response.data);
                $scope.newActivity = '';
            });
        };

        wishService.getActivities($scope.objective).then(function (response) {
            $scope.activities = response.data;
        });
    }]);