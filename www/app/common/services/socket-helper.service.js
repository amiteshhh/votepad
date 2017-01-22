(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.common.SocketHelperSvc
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
        .service('SocketHelperSvc', Svc);

    Svc.$inject = ['$rootScope', '$q', 'APP_CONFIG'];
    function Svc($rootScope, $q, APP_CONFIG) {
       
        return {
            connect: _connect
        };

        function _connect(path) {
        }
    }
})();
