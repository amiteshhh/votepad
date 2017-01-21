(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($urlRouterProvider) {
        // if none of the states are matched, use this as the fallback
        // ***** DON'T CHANGE THIS SYNTAX AS IT'S A WORKAROUND FOR $stateChangeStart event ****//
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            var $stateParams = $injector.get('$stateParams');
            var $localStorage = $injector.get('$localStorage');
            if ($localStorage.userInfo && $localStorage.userInfo.id) {
                $state.go('app.dashboard');//default nav for now
            } else {
                $state.go('auth');
            }
        });
    }

})();
