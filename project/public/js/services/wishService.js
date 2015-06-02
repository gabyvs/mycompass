angular.module('compassApp').factory('wishService', [
    '$http',
    function($http) {
        var service = {
            getWishes: function(period) {
                var route = '/api/purposes/';
                if (period) {
                    if (period.year) route += period.year;
                    if (period.quarter) route += '/' + period.quarter;
                    if (period.month) route += '/' + period.month;
                    if (period.week) route += '/' + period.week;
                    if (period.day) route += '/' + period.day;
                }
                return $http.get(route);
            },
            addWish: function(wish) {
                wish.since =  new Date().getTime();
                return $http.post('/api/wishes', wish);
            },
            makeAWish: function (wish) {
                return $http.put('/api/wishes/' + wish._id, wish);
            },
            deleteWish: function (wish) {
                return $http.delete('/api/wishes/' + wish._id);
            },
            getActivities: function (wish) {
                return $http.get('/api/wishes/' + wish._id + '/activities');
            },
            addActivity: function (label, objective) {
                var activity = {
                    label: label
                };
                if (objective) {
                    activity.year = objective.year;
                    activity.quarter = objective.quarter;
                    activity.month = objective.month;
                    activity.week = objective.week;
                    activity.day = objective.day;
                    activity.category = objective.category;
                    activity.parent = objective._id;
                }
                return service.addWish(activity);
            }
        };

        return service;
}]);