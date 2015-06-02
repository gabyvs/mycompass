angular.module('compassApp').controller('quarterBoard', [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    'configService',
    'wishService',
    function ($location, $routeParams, $scope, $timeout, configService, wishService) {
        $scope.year = $routeParams.year;
        $scope.quarter = $routeParams.quarter;

        $scope.yearObjectives = [];
        wishService.getWishes({ year: $scope.year }).then(function (response){
            $scope.yearObjectives = response.data;
        });
        $scope.yearMasterObjective = { year: $scope.year };

        $scope.quarterObjectives = [];
        wishService.getWishes({ year: $scope.year, quarter: $scope.quarter }).then(function (response){
            $scope.quarterObjectives = response.data;
        });
        $scope.quarterMasterObjective = { year: $scope.year, quarter: $scope.quarter };

        var months = [];
        var monthsHelper = moment().quarter($scope.quarter).startOf('quarter');
        months.push({ value: monthsHelper.month(), name: monthsHelper.format('MMM').toUpperCase() });
        months.push({ value: monthsHelper.add(1, 'M').month(), name: monthsHelper.format('MMM').toUpperCase() });
        months.push({ value: monthsHelper.add(1, 'M').month(), name: monthsHelper.format('MMM').toUpperCase() });
        $scope.months = months;

        _.forEach($scope.months, function (month) {
            wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: month.value, week: 'any' }).then(function (response){
                month.objectives = response.data;
                month.masterObjective = { year: $scope.year, quarter: $scope.quarter, month: month.value };
                Sortable.create(document.getElementsByClassName('M' + month.value + 'Objectives')[0], $scope.sortOptions);
            });
        });

        $scope.goTo = function (goToQuarter) {
            var newQuarter = Number($scope.quarter) + (goToQuarter);
            $location.url('/board/' + $scope.year + '/' + newQuarter);
        };

        // Sortable
        $scope.sortOptions = {
            group: 'board',
            onAdd: function (event) {
                if(event.from === event.item.parentElement) return;
                var taskId = event.item.attributes.getNamedItem('taskid').value;
                var targetList = event.item.parentElement.attributes.getNamedItem('list').value;
                var wish = { _id: taskId, year: $scope.year };
                if (targetList === 'quarter') {
                    wish.quarter = $scope.quarter;
                } else if (targetList === 'month') {
                    wish.quarter = $scope.quarter;
                    wish.month = event.item.parentElement.attributes.getNamedItem('listid').value;
                }

                wishService.makeAWish(wish);
            }
        };

        $timeout(function () {
            Sortable.create(document.getElementsByClassName('yearObjectives')[0], $scope.sortOptions);
            Sortable.create(document.getElementsByClassName('quarterObjectives')[0], $scope.sortOptions);
        });
    }]);