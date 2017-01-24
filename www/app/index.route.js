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
                //if ($localStorage.userType) {
                    /*if ($localStorage.userType === 'host') {
                        $state.go('app.createEvent');
                    } else if ($localStorage.userType === 'participant') {
                        $state.go('app.event');
                    } else {
                        $state.go('auth');
                    }*/
                //}
                $state.go('app.dashboard');

            } else {
                $state.go('auth');
            }
        });
    }

})();
