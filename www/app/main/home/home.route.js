(function () {
    'use strict';

    var moduleName = 'app.home';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/home/home.html',
                    controller: 'HomeCtrl as vm'
                }
            }
        });
    }


})();