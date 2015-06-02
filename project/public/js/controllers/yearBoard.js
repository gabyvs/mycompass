angular.module('compassApp').controller('yearBoard', [
    '$location',
    '$modal',
    '$routeParams',
    '$scope',
    '$timeout',
    'configService',
    'wishService',
    function ($location, $modal, $routeParams, $scope, $timeout, configService, wishService) {
        $scope.year = $routeParams.year || new Date().getFullYear();
        $scope.yearMasterObjective = { year: $scope.year };

        $scope.quarters = [{ value: 1}, { value: 2 }, { value: 3 }, { value: 4 }];
        _.forEach($scope.quarters, function (quarter) {
            wishService.getWishes({ year: $scope.year, quarter: quarter.value, month: 'any', week: 'any' }).then(function (response){
                quarter.objectives = response.data;
                quarter.masterObjective = { year: $scope.year, quarter: quarter.value };
                Sortable.create(document.getElementsByClassName('Q' + quarter.value + 'Objectives')[0], $scope.sortOptions);
            });
        });

        $scope.wishes = [];
        wishService.getWishes().then(function (response){
            $scope.wishes = response.data;
        });

        $scope.yearObjectives = [];
        wishService.getWishes({ year: $scope.year }).then(function (response){
            $scope.yearObjectives = response.data;
        });

        $scope.goTo = function (goToYear) {
            var newYear = Number($scope.year) + (goToYear);
            $location.url('/board/' + newYear);
        };

        $scope.sortOptions = {
            group: 'board',
            onAdd: function (event) {
                if(event.from === event.item.parentElement) return;
                var taskId = event.item.attributes.getNamedItem('taskid').value;
                var targetList = event.item.parentElement.attributes.getNamedItem('list').value;
                var wish = { _id: taskId };
                if (targetList === 'year') {
                    wish.year = $scope.year;
                } else if (targetList === 'quarter') {
                    wish.year = $scope.year;
                    wish.quarter = event.item.parentElement.attributes.getNamedItem('listid').value;
                }

                wishService.makeAWish(wish);
            }
        };

        $timeout(function () {
            Sortable.create(document.getElementsByClassName('allWishes')[0], $scope.sortOptions);
            Sortable.create(document.getElementsByClassName('yearObjectives')[0], $scope.sortOptions);
        });
    }]);