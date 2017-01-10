(function () {
    'use strict';

    var moduleName = 'app',
            requires = [
                                
                // app core
                'app.core',

                // auth module
                'app.auth',

                // home module
                "app.home",

                //Common Module
                "app.common"

            ];

    angular.module(moduleName, requires);

})();