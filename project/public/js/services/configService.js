angular.module('compassApp').factory('configService', [
    '$http',
    function($http) {
        return {
            getPeriods : function() {
                return $http.get('/api/periods');
            }
        }
}]);