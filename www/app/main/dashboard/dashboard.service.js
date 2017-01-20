(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .service('DashboardSvc', DashboardSvc);

    DashboardSvc.$inject = [];
    function DashboardSvc() {
    }
})();
