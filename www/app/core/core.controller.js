(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$injector', '$state', '$localStorage', '$ionicModal'];
    function Ctrl($scope, $injector, $state, $localStorage, $ionicModal) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var chatBoxes ;

        vm.host = false;
        console.log("Inside AppCtrl");
        init();

        function init() {
           OnlineUserSvc.init();
           vm.onlineUsers = OnlineUserSvc.onlineUsers;
           $scope.$on('socket-private-message', handlePrivateMessage);
        }

        vm.logout = function () {
            delete $localStorage.userInfo;
            delete $localStorage.userType;
            $state.go('auth');
        };

        function handlePrivateMessage(event, data){
            console.log('private message', data);
        }
    }
})();
