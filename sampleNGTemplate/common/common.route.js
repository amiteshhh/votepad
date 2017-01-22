(function () {
    'use strict';
    /**
     * Module: app.common
     * Configuration and Routing related stuff
     * Note: #### Tweak the route config as per your state and folder structure  ####
     */
    var moduleName = 'app.common';

    angular.module(moduleName).config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('app.common', {
            url: '/common',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/common/common.html',
                    controller: '"CommonCtrl" as vm'
                }
            }
        });
    }
})();
