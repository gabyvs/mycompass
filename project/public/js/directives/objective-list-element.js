angular.module('compassApp').directive('objectiveListElement', [
    '$modal',
    'wishService',
    function($modal, wishService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/objective.html',
            scope: {
                objective: '=',
                objectives: '=',
                showTooltip: '='
            },
            link: function (scope) {
                scope.editObjective = function () {
                    var options = {
                        animation: true,
                        size: 'lg',
                        templateUrl: 'views/modals/editObjective.html',
                        controller: 'editObjective',
                        resolve: {
                            objective: function () { return scope.objective;},
                            objectives: function () { return scope.objectives; }
                        }
                    };
                    $modal.open(options).result.then(function (result) {
                        if (result === 'deleted') {
                            _.remove(scope.objectives, { _id: scope.objective._id });
                        } else {
                            scope.objective = result;
                        }
                    });
                };

                scope.changeStatus = function () {
                    var newStatus;
                    switch (scope.objective.status) {
                        case 'started':
                            newStatus = 'closed';
                            break;
                        case 'closed':
                            newStatus = 'new';
                            break;
                        case 'new':
                        default:
                            newStatus = 'started';
                            break;
                    }
                    scope.objective.status = newStatus;
                    wishService.makeAWish(scope.objective);
                };
            }
        };
    }
]);