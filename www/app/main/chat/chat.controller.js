(function () {
    'use strict';

    var moduleName = 'app.chat';

    angular.module(moduleName)
            .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', '$stateParams', '$ionicPopup', '$timeout'];
    function ChatController($scope, $stateParams, $ionicPopup, $timeout) {
        var vm = this;
//        vm.data = {};
//        vm.data.message = "";
//        vm.messages = Chat.getMessages();
//        var typing = false;
//        var lastTypingTime;
//        var TYPING_TIMER_LENGTH = 250;
//
//        Socket.on('connect', function () {
//            Socket.emit('add user', "username");
//            Chat.setUsername("username");
//
//            if (!vm.data.username) {
//                var nicknamePopup = $ionicPopup.show({
//                    template: '<input id="usr-input" type="text" ng-model="data.username" autofocus>',
//                    title: 'What\'s your nickname?',
//                    scope: $scope,
//                    buttons: [{
//                            text: '<b>Save</b>',
//                            type: 'button-positive',
//                            onTap: function (e) {
//                                if (!vm.data.username) {
//                                    e.preventDefault();
//                                } else {
//                                    return vm.data.username;
//                                }
//                            }
//                        }]
//                });
//                nicknamePopup.then(function (username) {
//                    Socket.emit('add user', username);
//                    Chat.setUsername(username);
//                });
//            }
//
//        });
//
//        Chat.scrollBottom();
//
//        if ($stateParams.username) {
//            vm.data.message = "@" + $stateParams.username;
//            document.getElementById("msg-input").focus();
//        }
//
//        var sendUpdateTyping = function () {
//            if (!typing) {
//                typing = true;
//                Socket.emit('typing');
//            }
//            lastTypingTime = (new Date()).getTime();
//            $timeout(function () {
//                var typingTimer = (new Date()).getTime();
//                var timeDiff = typingTimer - lastTypingTime;
//                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
//                    Socket.emit('stop typing');
//                    typing = false;
//                }
//            }, TYPING_TIMER_LENGTH);
//        };
//
//        vm.updateTyping = function () {
//            sendUpdateTyping();
//        };
//
//        vm.messageIsMine = function (username) {
//            return vm.data.username === username;
//        };
//
        vm.getBubbleClass = function (username) {
            var classname = 'from-them';
            if (vm.messageIsMine(username)) {
                classname = 'from-me';
            }
            return classname;
        };

        vm.sendMessage = function (msg) {
            //Chat.sendMessage(msg);
            //vm.data.message = ""; 
            alert(msg);;
        };
    }
})();
