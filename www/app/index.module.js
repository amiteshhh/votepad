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

            // home module
            "app.home",

            // event module
            "app.event"

        ];

    angular.module(moduleName, requires);

})();