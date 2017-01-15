(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.dashboard', {
            url: '/dashboard',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/dashboard/dashboard.html',
                    controller: 'DashboardCtrl as vm'
                }
            }
        });
    }


})();