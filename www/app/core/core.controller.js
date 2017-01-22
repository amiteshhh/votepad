(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$state', '$localStorage'];
    function Ctrl($injector, $state, $localStorage) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');

        vm.host = false;
        console.log("Inside AppCtrl");
        init();

        function init() {
           OnlineUserSvc.init();
           vm.onlineUsers = OnlineUserSvc.onlineUsers;
        }

        vm.logout = function () {
            delete $localStorage.signInInfo;
            delete $localStorage.signUpInfo;
            $state.go('auth');
        };
    }
})();
