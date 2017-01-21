(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$state', '$localStorage'];
    function Ctrl($state, $localStorage) {
        var vm = this;

        vm.host = false;
        console.log("Inside AppCtrl");
        init();

        function init() {

        }

        vm.logout = function () {
            delete $localStorage.signInInfo;
            delete $localStorage.signUpInfo;
            $state.go('auth');
        };
    }
})();
