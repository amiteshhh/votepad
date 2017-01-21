(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.profile.ProfileSvc
     *
     * @description
     * Service to manage `app.profile` module
     *
     * @requires $http
     * @requires $q
     * @requires APP_CONFIG
     */

    var moduleName = 'app.profile';

    angular.module(moduleName)
        .service('ProfileSvc', Svc);
    /* Tweak the dependency like APP_CONFIG as per your requirement */
    Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc($http, $q, APP_CONFIG) {

        return {
            sampleOperation: _sampleOperation
        };

        /**
         * @ngdoc function  
         * @name app.profile.ProfileSvc#sampleOperation
         *
         * @description
         * It does sample operation.
         * @param {number} Id Employee Id.
         * 
         * @methodOf app.about.AboutSvc
         * @returns {Promise} which resolves to list of items
         */
        function _sampleOperation(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/profile/';
            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
})();
