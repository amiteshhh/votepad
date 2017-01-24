(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.poll.PollCtrl:PollCtrl
     *
     * @description
     * PollCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.poll';

    angular.module(moduleName)
        .controller('PollCtrl', Ctrl);

    Ctrl.$inject = ['$state', '$stateParams', '$injector', '$rootScope', '$scope', '$ionicModal', '$localStorage', '$ionicLoading', '$ionicPopup', '$timeout'];
    function Ctrl($state, $stateParams, $injector, $rootScope, $scope, $ionicModal, $localStorage, $ionicLoading, $ionicPopup, $timeout) {
        var vm = this;
        var PollSvc = $injector.get('PollSvc');
        var EventSvc = $injector.get('EventSvc');
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var id = $stateParams.id;
        var myChatId = $rootScope.myChatSocket.id;
        var roomId, roomName = id;
        var rooms = OnlineUserSvc.rooms;
        vm.disableResponse = true;
        //vm.prevResponseOptionId;

        //
        var chatTo = $rootScope.onlineUsers[0];
        //var msg = $stateParams.msg;
        var recipientId = chatTo.id;
        var recipientName = vm.recipientName = chatTo.user.userName;

        init();

        console.log($stateParams);


        function init() {
            console.log("inside Poll controller");

            _findOneDeep(id);
        }

        function _findOneDeep(id) {
            EventSvc.findOneDeep(id).then(function (data) {
                vm.event = data;
                if (vm.event.eventStatus === 'created') {//only owner can come here
                    EventSvc.createOrUpdate({
                        id: vm.event.id,
                        eventStatus: 'open'
                    });
                    vm.event.eventStatus = 'open';
                    broadcastPollStart();
                }
                vm.isEventOwner = vm.event.eventHostedBy.id === $rootScope.userInfo.id;
                if (!vm.isEventOwner) {
                    EventSvc.pushEventUserRef(vm.event.id, 'eventParticipants', $rootScope.userInfo.id, true);
                }



                vm.disableResponse = (vm.event.eventStatus === 'closed' || (vm.event.templateType !== 'text' && vm.event.eventHostedBy.id === $rootScope.userInfo.id));
                console.log(data);
                vm.liked = hasEventUserRef(vm.event, 'eventLikedBy', $rootScope.userInfo.id);

                if (vm.event.templateType === 'text') {
                    vm.messages = vm.event.textTemplates;
                } else if (vm.event.templateType === 'multiSelect') {
                    initCheckBoxState();
                } else {

                    _.some(vm.event.optionTemplate.options, function (option) {
                        var respondedBy = _.findWhere(option.optionRespondedBy, { id: $rootScope.userInfo.id });
                        if (respondedBy) {
                            vm.selectedAnswer = option;
                            vm.prevResponseOptionId = option.id;
                        }
                        return respondedBy;
                    });
                }
                //_createOrJoinRoom(vm.event);
            }, handleServiceError);
        }

        function initCheckBoxState() {
            _.each(vm.event.optionTemplate.options, function (option) {
                option.checked = _.some(option.optionRespondedBy, function (user) {
                    return user.id === $rootScope.userInfo.id;
                });
                option.originalChecked = option.checked;
            });
        }

        function hasEventUserRef(event, fk, fkId) {
            return _.some(event[fk], function (likedBy) {
                return likedBy.id === fkId;
            });
        }

        vm.showRespondedUsersList = function (users) {
            if (!users || !users.length) {
                return;
            }
            $rootScope.$broadcast('showUsersList', users);
        };

        vm.toggleLikeEvent = function () {
            vm.liked = !vm.liked;
            EventSvc.pushEventUserRef(vm.event.id, 'eventLikedBy', $rootScope.userInfo.id, vm.liked).then(function (data) {
                console.log(data);

            }, handleServiceError);
        };

        vm.saveSingleResponse = function () {
            $ionicLoading.show();
            if (vm.prevResponseOptionId) {//delete prev response
                EventSvc.pushOptionRespondedBy(vm.prevResponseOptionId, $rootScope.userInfo.id, true).then(function (data) {
                    console.log(data);
                }, handleServiceError);
            }
            EventSvc.pushOptionRespondedBy(vm.selectedAnswer.id, $rootScope.userInfo.id).then(function (data) {
                console.log(data);
                vm.prevResponseOptionId = vm.selectedAnswer.id;
                iqwerty.toast.Toast('Response submitted successfully !');
            }, handleServiceError).finally($ionicLoading.hide);
        };

        vm.saveMultiResponse = function () {
            $ionicLoading.show();
            _.each(vm.event.optionTemplate.options, function (option) {
                if (option.checked && !option.originalChecked) {//new one
                    EventSvc.pushOptionRespondedBy(option.id, $rootScope.userInfo.id);
                } else if (!option.checked && option.originalChecked) {//delete this
                    EventSvc.pushOptionRespondedBy(option.id, $rootScope.userInfo.id, true);
                }
            });
            $timeout(function () {
                $ionicLoading.hide();
                iqwerty.toast.Toast('Response submitted successfully !');
            }, 200);
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }



        function _createOrJoinRoom(event) {
            if (rooms.length) {
                _joinRoom(event);
            } else {
                _createRoom(event);
            }
        }

        function _createRoom(event) {
            socketInstance.post('/room', { name: roomName }, function (data) {
                EventSvc.createOrUpdate({
                    id: vm.event.id,
                    eventStatus: 'open'
                });
                // Add the new room to the rooms list
                //addRoom(data);
                // Create the room HTML
                //createPublicRoom({ id: data.id, name: data.name });
                roomId = data.id;
                // Join the room
                socketInstance.post('/room/' + data.id + '/onlineUsers', { id: $rootScope.myChatSocket.id });

                // Set the room user count to 1
                //increaseRoomCount(data.id);

            });
        }

        // Join the room currently selected in the list
        function _joinRoom() {
            roomId = rooms[0].id;
            // Join the room
            socketInstance.post('/room/' + roomId + '/onlineUsers', { id: myChatId });
        }



        // Callback for when the user clicks the "Send message" button in a public room
        vm.sendMessage_bak = function () {

            if (!vm.message) {
                return;
            }
            saveMessage(vm.message);
            // Add this message to the room
            addMessageToChatRoom(myChatId, roomId, vm.message);

            // Send the message
            var data = {
                roomId: roomId,
                from: $rootScope.myChatSocket,
                msg: vm.message
            };
            socketInstance.post('/chat/public', data);
            vm.message = undefined;
        };

        vm.sendMessage = function () {
            if (!vm.message) {
                return;
            }
            saveMessage(vm.message);
            // Add this message to the room
            addMessageToConversation($rootScope.myChatSocket, recipientId, vm.message);

            // Send the message
            var data = {
                to: recipientId,
                from: $rootScope.myChatSocket,
                msg: vm.message,
                event: vm.event
            };
            socketInstance.post('/chat/private', data);
            //socketInstance.request({ url: '/chat/private', method: 'POST', data: { to: recipientId, msg: vm.message } });
            vm.message = undefined;
        };

        function broadcastPollStart() {
            // Send the message
            var data = {
                to: recipientId,
                from: $rootScope.myChatSocket,
                msg: '',
                event: vm.event
            };
            socketInstance.post('/chat/private', data);
        }

        function saveMessage(question) {
            var textTemplate = {
                cssId: 'Q' + vm.event.textTemplates.length,
                question: question,
                textTemplateCreatedBy: $rootScope.userInfo.id,
                //textTemplateEventXRef: vm.event.id
            };
            //vm.event.textTemplates.push();
            //EventSvc.saveTextTemplate(textTemplate);
            EventSvc.createOrUpdate(vm.event);
        }

        // Add HTML for a new message in a public room
        function addMessageToChatRoom(sender, roomId, message) {

            var className, fromMe = senderId === myChatId;
            /*if (fromMe) {
                senderName = 'Me';
                className = 'from-me';
            } else {
                senderName = recipientName || 'Unknown';
                className = 'from-them';
            }*/

            sender =
                vm.messages.push({
                    question: message,
                    textTemplateCreatedBy: sender,
                    className: className,
                    updatedAt: new Date()
                });

            /*EventSvc.createOrUpdate({
                id: vm.event.id,
                eventStatus: 'open'
            });*/

            /*if (senderId === 0) {
                return postStatusMessage(roomName, message);
            }*/

        }

        // Handle an incoming public message from the server.

        function receiveRoomMessage(event, data) {

            var sender = data.from;
            var room = data.room;

            // Add a message to the room
            addMessageToChatRoom(sender.id, room.id, data.msg);
        }



        // Handle the user clicking the "Leave Room" button for a public room
        function leaveRoom() {
            // Call the server to leave the room
            socketInstance.delete('/room/' + roomId + '/onlineUsers', { id: myChatId });

        }
        $scope.$on('socket-room-message', receiveRoomMessage);
        //$scope.$broadcast('socket-room-new-user', message);
        // $scope.$broadcast('socket-room-user-removed', message);
        $scope.$broadcast('socket-room-closed', onRoomClose);

        function onRoomClose() {
            alert('this poll has been closed now!!');
            vm.disableResponse = true;
        }

        ////
        // Add HTML for a new message in a private conversation
        function addMessageToConversation(sender, recipientId, message) {

            var senderName, className, fromMe = sender.Id === myChatId;
            if (fromMe) {
                senderName = 'Me';
                className = 'from-me';
            } else {
                senderName = recipientName;
                className = 'from-them';
            }
            vm.messages.push({
                question: message,
                textTemplateCreatedBy: sender.user,
                className: className,
                updatedAt: new Date()
            });
        }

        // Handle an incoming private message from the server.
        function receivePrivateMessage(event, data) {

            var sender = data.from;

            // Create a room for this message if one doesn't exist
            //createPrivateConversationRoom(sender);

            // Add a message to the room
            addMessageToConversation(sender, myChatId, data.msg);
            $scope.$apply();
        }

        $scope.$on('socket-private-message', receivePrivateMessage);

    }
})();