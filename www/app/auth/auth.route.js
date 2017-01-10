(function () {
    'use strict';

    var appName = 'app.auth';

    angular.module(appName).config(config);

    function config($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'app/auth/login.html',
                controller: 'AuthCtrl as vm'
            });
    }

})();