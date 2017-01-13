(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.event', {
            url: '/event',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/event/event.html',
                    controller: 'EventCtrl as vm'
                }
            }
        });
    }


})();