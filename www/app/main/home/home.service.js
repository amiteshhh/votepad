(function () {
    'use strict';

    var moduleName = 'app.home';

    angular.module(moduleName)
        .service('HomeSvc', Svc);

    Svc.$inject = [];
    function Svc() {
    }
})();
