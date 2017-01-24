(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.common.OnlineUserSvc
     *
     * @description
     * Service to manage `app.common` module
     *
     * @requires $rootScope
     * @requires $q
     * @requires APP_CONFIG
     */

    var moduleName = 'app.common';

    angular.module(moduleName)
        .service('UpdateUserInfo', Svc);

    Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc($http, $q, APP_CONFIG) {
        
        return {
            updateUserInfo: _updateUserInfo
        };

        function _updateUserInfo(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/user/' + id;
            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

    }
})();
