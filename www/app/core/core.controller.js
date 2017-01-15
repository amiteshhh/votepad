(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = [];
    function Ctrl() {
       var vm = this;

       vm.host = false;
    }
})();
