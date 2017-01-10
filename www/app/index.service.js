(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName)
        .service('IndexSvc', Svc);

    Svc.$inject = [];
    function Svc() {
    }
})();
