angular.module('compassApp').controller('weekBoard', [
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
        $scope.week = Number($routeParams.week);
        $scope.monthName = moment().month($scope.month).format("MMMM");

        $scope.monthObjectives = [];
        wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: $scope.month }).then(function (response){
            $scope.monthObjectives = response.data;
        });
        $scope.monthMasterObjective = { year: $scope.year, quarter: $scope.quarter, month: $scope.month };

        $scope.weekObjectives = [];
        wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: $scope.week  }).then(function (response){
            $scope.weekObjectives = response.data;
        });
        $scope.weekMasterObjective = { year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: $scope.week };

        var days = [];
        var dayHelper = moment().isoWeekday(1).week($scope.week).startOf('isoweek');
        days.push({ value: dayHelper.date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        days.push({ value: dayHelper.add(1, 'd').date(), label: dayHelper.format('ddd') });
        $scope.days = days;

        _.forEach($scope.days, function (day) {
            wishService.getWishes({ year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: $scope.week, day: day.value }).then(function (response){
                day.objectives = response.data;
                day.masterObjective = { year: $scope.year, quarter: $scope.quarter, month: $scope.month, week: $scope.week, day: day.value };
                Sortable.create(document.getElementsByClassName(day.label + 'Objectives')[0], $scope.sortOptions);
            });
        });

        $scope.goTo = function (goToWeek) {
            var newWeek = $scope.week + (goToWeek);
            var newMonth = moment().month(newWeek).month();
            var newQuarter = moment().month(newMonth).quarter();
            $location.url('/board/' + $scope.year + '/' + newQuarter + '/' + newMonth + '/' + newWeek);
        };

        // Sortable
        $scope.sortOptions = {
            group: 'board',
            onAdd: function (event) {
                if(event.from === event.item.parentElement) return;
                var taskId = event.item.attributes.getNamedItem('taskid').value;
                var targetList = event.item.parentElement.attributes.getNamedItem('list').value;
                var wish = { _id: taskId, year: $scope.year, quarter: $scope.quarter, month: $scope.month };
                if (targetList === 'week') {
                    wish.week = $scope.week;
                } else if (targetList === 'day') {
                    wish.week = $scope.week;
                    wish.day = event.item.parentElement.attributes.getNamedItem('listid').value;
                }

                wishService.makeAWish(wish);
            }
        };

        $timeout(function () {
            Sortable.create(document.getElementsByClassName('monthObjectives')[0], $scope.sortOptions);
            Sortable.create(document.getElementsByClassName('weekObjectives')[0], $scope.sortOptions);

        });
    }]);