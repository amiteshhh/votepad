(function () {
    'use strict';
    /**
     * Module: app.editEvent
     * Configuration and Routing related stuff
     * Note: #### Tweak the route config as per your state and folder structure  ####
     */
    var moduleName = 'app.editEvent';

    angular.module(moduleName).config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('app.editEvent', {
            url: '/editEvent/:templateType/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/editEvent/editEvent.html',
                    controller: 'EditEventCtrl as vm'
                }
            }
        });
    }
})();
