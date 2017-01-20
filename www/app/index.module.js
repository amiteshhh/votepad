(function () {
    'use strict';

    var moduleName = 'app',
        requires = [

            // app core
            'app.core',

            // auth module
            'app.auth',

            //Common Module
            "app.common",

            //Dashboard Module
            "app.dashboard",

            // registration module
            "app.participents",

            // home module
            "app.createEvent",

            // event module
            "app.event",
            
            // chat module
            "app.chat"

        ];

    angular.module(moduleName, requires);

})();