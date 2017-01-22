(function () {
    'use strict';

    var moduleName = 'app.chat';

    angular.module(moduleName)
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicPopup', '$timeout'];
    function ChatController($scope, $rootScope, $stateParams, $ionicPopup, $timeout) {
        var vm = this;
        var chatTo = $stateParams.chatTo;
        var myChatId = $rootScope.myChatSocket.id;
        var recipientId = chatTo.id;
        var recipientName = vm.recipientName = chatTo.user.userName;

        vm.messages = [];

        vm.sendMessage = function () {
            if (!vm.message) {
                return;
            }
            // Add this message to the room
            addMessageToConversation(myChatId, recipientId, vm.message);

            // Send the message
            //socketInstance.post('/chat/private', { to: recipientId, msg: vm.message });
            socketInstance.request({ url: '/chat/private', method: 'POST', data: { to: recipientId, msg: vm.message } });
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
                className: className
            });
        }

        // Handle an incoming private message from the server.
        function receivePrivateMessage(data) {

            var sender = data.from;

            // Create a room for this message if one doesn't exist
            //createPrivateConversationRoom(sender);

            // Add a message to the room
            addMessageToConversation(sender.id, myChatId, data.msg);
        }
    }
})();
