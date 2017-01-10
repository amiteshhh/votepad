(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName)
        .value('APP_CONFIG', {
            SERVER_URL: 'http://localhost',
            REST_ENDPOINT: '/rs',
        });

})();
