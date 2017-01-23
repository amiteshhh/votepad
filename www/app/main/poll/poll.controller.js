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

        vm.event = $stateParams.eventModel;
        var myChatId = $rootScope.myChatSocket.id;
        var roomId, roomName = vm.event.id;
        var rooms = OnlineUserSvc.rooms;

        if (!$rootScope.userType) {
            $rootScope.userType = ($localStorage.userType === 'host' ? true : false);
        }
        vm.liked = false;

        init();

        console.log($stateParams);


        function init() {
            console.log("inside Poll controller");
            vm.messages = vm.event.textTemplates;
            vm.liked = hasEventUserRef(vm.event, 'eventLikedBy', $rootScope.userInfo.id);
            _createOrJoinRoom(vm.event);
            //_findeOne(vm.event.id);
        }

        function hasEventUserRef(event, fk, fkId) {
            return _.some(event[fk], function (likedBy) {
                return likedBy.id === fkId;
            });
        }

        vm.showRespondedUsersList = function () {
            $rootScope.$broadcast('showUsersList', {
                userList: vm.event.eventLikedBy
            });
        };

        vm.toggleLikeEvent = function () {
            vm.liked = !vm.liked;
            EventSvc.pushEventUserRef(vm.event.id, 'eventLikedBy', $rootScope.userInfo.id, vm.liked).then(function (data) {
                console.log(data);

            }, handleServiceError);
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }

        function _findeOne(id) {
            EventSvc.findOne(id).then(function (data) {
                vm.event = data;
                console.log(data);
            }, handleServiceError);
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
        vm.sendMessage = function () {

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
        function addMessageToChatRoom(senderId, roomId, message) {

            var senderName, className, fromMe = senderId === myChatId;
            if (fromMe) {
                senderName = 'Me';
                className = 'from-me';
            } else {
                senderName = 'recipientName';
                className = 'from-them';
            }
            vm.messages.push({
                question: message,
                senderName: 'senderName',
                className: className
            });

            EventSvc.createOrUpdate({
                id: vm.event.id,
                eventStatus: 'open'
            });

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
        }

    }
})();