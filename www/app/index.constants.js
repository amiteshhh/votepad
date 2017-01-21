(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName)
        .value('APP_CONFIG', {
            SERVER_URL: 'http://localhost:1337',
            //SERVER_URL: 'https://obscure-forest-59301.herokuapp.com',
            REST_ENDPOINT: '',
        });

})();
