(function () {
    'use strict';
    /**
     * Module: app.about
     * Service: AboutSvc
     * Description: Service to manage about
     * Note: #### Tweak the dependency like APP_CONFIG as per your requirement ####
     */

    var moduleName = 'app.about';

    angular.module(moduleName)
        .service('AboutSvc', Svc);

   // Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc(/*$http, $q, APP_CONFIG*/) {

/*        return {
            sampleOperation: _sampleOperation
        };

        function _sampleOperation() {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/about/';
            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }*/
    }
})();
