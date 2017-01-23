(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .service('DashboardSvc', DashboardSvc);

    DashboardSvc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function DashboardSvc($http, $q, APP_CONFIG) {

        return {            
            find: _find
        };

        function _find() {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/find';
            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
})();
