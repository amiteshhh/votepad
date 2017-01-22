(function () {
    'use strict';
    /**
     * Module: app.poll
     * Configuration and Routing related stuff
     * Note: #### Tweak the route config as per your state and folder structure  ####
     */
    var moduleName = 'app.poll';

    angular.module(moduleName).config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('app.poll', {
            url: '/poll',
            params: {
                "eventModel": null,
                "userType": null
            },
            views: {
                'menuContent': {
                    templateUrl: 'app/main/poll/poll.html',
                    controller: 'PollCtrl as vm'
                }
            }
        });
    }
})();
