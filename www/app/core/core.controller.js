(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$rootScope', '$injector', '$state', '$localStorage', '$ionicModal', '$timeout', '$ionicPopup'];
    function Ctrl($scope, $rootScope, $injector, $state, $localStorage, $ionicModal, $timeout, $ionicPopup) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var chatBoxes;

        console.log("Inside AppCtrl");

        init();

        function init() {
            OnlineUserSvc.init();
            $rootScope.onlineUsers = vm.onlineUsers = OnlineUserSvc.onlineUsers;
            $rootScope.rooms = vm.rooms = OnlineUserSvc.rooms;
            $rootScope.userInfo = $localStorage.userInfo;
            $rootScope.userType = $localStorage.userType;
            $scope.$on('socket-private-message', receivePrivateMessage);
            $scope.$on('socket-new-room', handleNewRoomAdd);
        }

        vm.logout = function () {
            delete $localStorage.userInfo;
            delete $localStorage.userType;
            $state.go('auth');
        };

        var lastChatToId;
        function receivePrivateMessage(event, data) {
            console.log('private message', data);
            var incomingChatId = data.from.id;
            if ($state.current.name === 'app.chat'/* && lastChatToId === incomingChatId*/) {
                return;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'New message from ' + data.from.user.userName,
                template: '<p><strong>Message:</strong> ' + data.msg + '</p>' + ' We dont support multiple parallel chat as of now. <br>Do You want to chat.!'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    lastChatToId = data.from.id;
                    $state.go('app.chat', { chatTo: data.from, msg: data.msg });
                } else {
                    console.log('You are not sure');
                }
            });
        }

        function handleNewRoomAdd(event, data) {
            console.log('new room', data);
            var eventId = parseInt(data.name, 10);
            var eventModel = _.findWhere($rootScope.events, { id: eventId });
            if (eventModel) {
                eventModel.eventStatus = 'open';
            }
        }

        vm.closeUserModal = function () {
            vm.usersListModal.hide();
            $timeout(function () {
                vm.usersListModal.remove();
            }, 500);
        };

        $rootScope.$on('showUsersList', function (event, data) {

            console.log(data);
            vm.usersList = data;
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