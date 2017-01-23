(function () {
    'use strict';
    /**
     * Module: app.profile
     * Configuration and Routing related stuff
     * Note: #### Tweak the route config as per your state and folder structure  ####
     */
    var moduleName = 'app.profile';

    angular.module(moduleName).config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/profile/profile.html',
                    controller: 'ProfileCtrl as vm'
                }
            }
        });
    }
})();
