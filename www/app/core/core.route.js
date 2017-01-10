(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/core/menu.html',
                controller: 'AppCtrl as appVm',//appVm to distinguish it from other view specific vm
            })
            /**app.main state will create common left menu and container to inject the views
             * Note that Summary or details page has their own left menu and hence they are loaded directly
             * under menuContent and is not a child of app.main.
             */
            .state('app.main', {
                url: '/main',
                abstract: true
            });
    }

})();