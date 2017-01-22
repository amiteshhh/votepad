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
        var socketBaseUrl = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT;
        io.sails.autoConnect = true;
        io.sails.url = socketBaseUrl;
        var socket = io.socket;//io.sails.connect(socketUrl);
        return {
            registerEvent: _registerEvent
        };

        function _registerEvent(path) {
            //socket.get('/' + path, function (resData, jwres) { console.log('socekt get', resData); });
            socket.get('/event' , function (resData, jwres) { console.log('socekt get', resData); });
            socket.get('/user' , function (resData, jwres) { console.log('socekt get', resData); });
            
            socket.on('event', function (event) { console.log('event received socket', event); });
            socket.on('user', function (event) { console.log('user received socket', event); });
        }
    }
})();
