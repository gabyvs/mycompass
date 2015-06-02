angular.module('compassApp').directive('addObjective', [
    'wishService',
    function (wishService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/add-objective.html',
            scope: {
                objectives: '=',
                parent: '=',
                showOn: '='
            },
            link: function (scope) {
                scope.addActivity = function () {
                    if (!scope.objective) { return; }
                    wishService.addActivity(scope.objective, scope.parent).then(function (response) {
                        scope.showOn = false;
                        scope.objective = '';
                        scope.objectives.push(response.data);
                    });
                };

                scope.clearObjective = function (event) {
                    if (!event.relatedTarget || event.relatedTarget.className.indexOf('add-activity') == -1 || !scope.objective) {
                        scope.showOn = false;
                        scope.objective = '';
                    } else {
                        scope.addActivity();
                    }
                };
            }
        };
}]);