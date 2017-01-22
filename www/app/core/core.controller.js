(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$injector', '$state', '$localStorage', '$ionicModal', '$ionicPopup'];
    function Ctrl($scope, $injector, $state, $localStorage, $ionicModal, $ionicPopup) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var chatBoxes;

        vm.host = false;
        console.log("Inside AppCtrl");
        init();

        function init() {
            OnlineUserSvc.init();
            vm.onlineUsers = OnlineUserSvc.onlineUsers;
            $scope.$on('socket-private-message', receivePrivateMessage);
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
    }
})();
