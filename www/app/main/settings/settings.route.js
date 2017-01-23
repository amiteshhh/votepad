(function () {
    'use strict';
    /**
     * Module: app.settings
     * Configuration and Routing related stuff
     * Note: #### Tweak the route config as per your state and folder structure  ####
     */
    var moduleName = 'app.settings';

    angular.module(moduleName).config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('app.settings', {
            url: '/settings',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/settings/settings.html',
                    controller: 'SettingsCtrl as vm'
                }
            }
        });
    }
})();
