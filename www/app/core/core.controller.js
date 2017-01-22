(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$rootScope', '$injector', '$state', '$localStorage', '$ionicModal', '$timeout'];
    function Ctrl($scope, $rootScope, $injector, $state, $localStorage, $ionicModal, $timeout) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var chatBoxes;

        console.log("Inside AppCtrl");
        if(!$rootScope.userType) {
            $rootScope.userType = ($localStorage.userType === 'host' ? true : false); 
        }
        
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

        function handlePrivateMessage(event, data) {
            console.log('private message', data);
        }

        vm.closeUserModal = function () {
            vm.usersListModal.hide();
            $timeout(function () {
                vm.usersListModal.remove();
            }, 500);
        };

        $rootScope.$on('showUsersList', function (event, data) {

            console.log(data);
            vm.usersList = [{
                userName: "Sourav"
            },
            {
                userName: "Amitesh"
            }];
            $ionicModal.fromTemplateUrl('app/common/templates/user-list-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.usersListModal = modal;
                modal.show();
            });
        });
    }
})();