(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
            .config(config);

    function config($ionicConfigProvider) {
        // Disable view caching
        $ionicConfigProvider.views.maxCache(0);
    }

})();