(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = [];
    function Ctrl() {
        var socketUrl = 'http://localhost:1337';
        var socket = io.sails.connect(socketUrl);
        //io.sails.url = socketUrl;
        socket.get('/event', function (resData, jwres) { console.log('socekt get', resData); });
        socket.on('event', function (event) { console.log('event received socket', event); });
    }
})();
