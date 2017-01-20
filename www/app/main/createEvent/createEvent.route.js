(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.createEvent', {
            url: '/createEvent',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/createEvent/createEvent.html',
                    controller: 'CreateEventCtrl as vm'
                }
            }
        });
    }


})();