(function () {
    'use strict';

    var moduleName = 'app.chat';

    angular.module(moduleName)
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicPopup', '$timeout', '$ionicScrollDelegate'];
    function ChatController($scope, $rootScope, $stateParams, $ionicPopup, $timeout, $ionicScrollDelegate) {
        var vm = this;
        var chatTo = $stateParams.chatTo;
        var msg = $stateParams.msg;
        var myChatId = $rootScope.myChatSocket.id;
        var recipientId = chatTo.id;
        var recipientName = vm.recipientName = chatTo.user.userName;

        vm.messages = [];

        init();

        function init() {
            if (msg) {
                addMessageToConversation(recipientId, myChatId, msg);
            }
            $timeout(function () {
                document.querySelector('#msg-input').focus();
            }, 100, false);
        }

        vm.sendMessage = function () {
            if (!vm.message) {
                return;
            }
            // Add this message to the room
            addMessageToConversation(myChatId, recipientId, vm.message);

            // Send the message
            var data = {
                to: recipientId,
                from: $rootScope.myChatSocket,
                msg: vm.message
            };
            socketInstance.post('/chat/private', data);
            //socketInstance.request({ url: '/chat/private', method: 'POST', data: { to: recipientId, msg: vm.message } });
            vm.message = undefined;
        };

        // Add HTML for a new message in a private conversation
        function addMessageToConversation(senderId, recipientId, message) {

            var senderName, className, fromMe = senderId === myChatId;
            if (fromMe) {
                senderName = 'Me';
                className = 'from-me';
            } else {
                senderName = recipientName;
                className = 'from-them';
            }
            vm.messages.push({
                message: message,
                senderName: senderName,
                className: className,
                updatedAt: new Date()
            });
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        }

        // Handle an incoming private message from the server.
        function receivePrivateMessage(event, data) {

            var sender = data.from;

            // Create a room for this message if one doesn't exist
            //createPrivateConversationRoom(sender);

            // Add a message to the room
            addMessageToConversation(sender.id, myChatId, data.msg);
            $scope.$apply();
        }

        $scope.$on('socket-private-message', receivePrivateMessage);
        $scope.$on('socket-remove-user-online', function (event, data) {
            if (recipientId === data.id) {//same as recipientId
                vm.userOffline = true;
                iqwerty.toast.Toast(recipientName + ' is now offline!');//same as recipientName
                $scope.$apply();
            }
        });
        $scope.$on('socket-new-user-online', function (event, data) {
            if (chatTo.user.id === data.user.id) {
                vm.userOffline = false;
                chatTo = data;
                recipientId = chatTo.id;
                recipientName = vm.recipientName = chatTo.user.userName;
                iqwerty.toast.Toast(recipientName + ' is now online !');
                $scope.$apply();
            }
        });


    }
})();
