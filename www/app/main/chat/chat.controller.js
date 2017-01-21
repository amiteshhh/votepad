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
//            Socket.emit('add user', "userName");
//            Chat.setUsername("userName");
//
//            if (!vm.data.userName) {
//                var nicknamePopup = $ionicPopup.show({
//                    template: '<input id="usr-input" type="text" ng-model="data.userName" autofocus>',
//                    title: 'What\'s your nickname?',
//                    scope: $scope,
//                    buttons: [{
//                            text: '<b>Save</b>',
//                            type: 'button-positive',
//                            onTap: function (e) {
//                                if (!vm.data.userName) {
//                                    e.preventDefault();
//                                } else {
//                                    return vm.data.userName;
//                                }
//                            }
//                        }]
//                });
//                nicknamePopup.then(function (userName) {
//                    Socket.emit('add user', userName);
//                    Chat.setUsername(userName);
//                });
//            }
//
//        });
//
//        Chat.scrollBottom();
//
//        if ($stateParams.userName) {
//            vm.data.message = "@" + $stateParams.userName;
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
//        vm.messageIsMine = function (userName) {
//            return vm.data.userName === userName;
//        };
//
        vm.getBubbleClass = function (userName) {
            var classname = 'from-them';
            if (vm.messageIsMine(userName)) {
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
