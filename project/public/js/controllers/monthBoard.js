angular.module('compassApp').controller('monthBoard', [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    'configService',
    'wishService',
    function ($location, $routeParams, $scope, $timeout, configService, wishService) {
        $scope.year = $routeParams.year;
        $scope.quarter = Number($routeParams.quarter);
        $scope.month = Number($routeParams.month);
        $scope.monthName = moment().month($scope.month).format("MMMM");

        $scope.quarterObjectives = [];
        wishService.getWishes({ year: $scope.year, quarter: $scope.quarter }).then(function (response){
            $scope.quarterObjectives = response.data;
        });
        $scope.quarterMasterObjective = { year: $scope.year, quarter: $scope.quarter };

        $scope.monthObjectives = [];
        wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: $scope.month }).then(function (response){
            $scope.monthObjectives = response.data;
        });
        $scope.monthMasterObjective = { year: $scope.year, quarter: $scope.quarter, month: $scope.month };

        var weeks = [];
        var weekHelper = moment().isoWeekday(1).month($scope.month).startOf('month').startOf('isoweek');
        weeks.push({ value: weekHelper.week() });
        weeks.push({ value: weekHelper.add(1, 'w').week() });
        weeks.push({ value: weekHelper.add(1, 'w').week() });
        weeks.push({ value: weekHelper.add(1, 'w').week() });
        if (weekHelper.add(1, 'w').month() === $scope.month) { weeks.push({ value: weekHelper.week() }); }
        if (weekHelper.add(1, 'w').month() === $scope.month) { weeks.push({ value: weekHelper.week() }); }
        $scope.weeks = weeks;
        $scope.weekWidth = (100 / weeks.length) + '%';

        _.forEach($scope.weeks, function (week) {
            wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: week.value, day: 'any' }).then(function (response){
                week.objectives = response.data;
                week.masterObjective = { year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: week.value };
                Sortable.create(document.getElementsByClassName('w' + week.value + 'Objectives')[0], $scope.sortOptions);
            });
        });

        $scope.goTo = function (goToMonth) {
            var newMonth = $scope.month + (goToMonth);
            var newQuarter = moment().month(newMonth).quarter();
            $location.url('/board/' + $scope.year + '/' + newQuarter + '/' + newMonth);
        };

        // Sortable
        $scope.sortOptions = {
            group: 'board',
            onAdd: function (event) {
                if(event.from === event.item.parentElement) return;
                var taskId = event.item.attributes.getNamedItem('taskid').value;
                var targetList = event.item.parentElement.attributes.getNamedItem('list').value;
                var wish = { _id: taskId, year: $scope.year, quarter: $scope.quarter };
                if (targetList === 'month') {
                    wish.month = $scope.month;
                } else if (targetList === 'week') {
                    wish.month = $scope.month;
                    wish.week = event.item.parentElement.attributes.getNamedItem('listid').value;
                }

                wishService.makeAWish(wish);
            }
        };

        $timeout(function () {
            Sortable.create(document.getElementsByClassName('quarterObjectives')[0], $scope.sortOptions);
            Sortable.create(document.getElementsByClassName('monthObjectives')[0], $scope.sortOptions);
        });
    }]);