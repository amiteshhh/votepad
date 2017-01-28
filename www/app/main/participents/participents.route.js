(function () {
    'use strict';

    var moduleName = 'app.participents';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.participents', {
            url: '/participents',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/participents/participents.html',
                    controller: 'ParticipentsCtrl as vm'
                }
            }
        });
    }


})();