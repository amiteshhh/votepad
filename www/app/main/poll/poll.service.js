(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.poll.PollSvc
     *
     * @description
     * Service to manage `app.poll` module
     *
     * @requires $http
     * @requires $q
     * @requires APP_CONFIG
     */

    var moduleName = 'app.poll';

    angular.module(moduleName)
        .service('PollSvc', Svc);
    /* Tweak the dependency like APP_CONFIG as per your requirement */
    Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc($http, $q, APP_CONFIG) {

        return {
            //pushEventUserRef: _pushEventUserRef
        };

        
    }
})();
