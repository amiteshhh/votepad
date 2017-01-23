(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.common.OnlineUserSvc
     *
     * @description
     * Service to manage `app.common` module
     *
     * @requires $rootScope
     * @requires $q
     * @requires APP_CONFIG
     */

    var moduleName = 'app.common';

    angular.module(moduleName)
        .service('OnlineUserSvc', Svc);

    Svc.$inject = ['$rootScope'];
    function Svc($rootScope) {
        var onlineUsers = [], rooms = [];
        var isInited = false, activeRoom;
        return {
            init: _init,
            onlineUsers: onlineUsers,
            rooms: rooms
        };

        function _init() {
            console.log('init socket online users');
            if (isInited) {
                return;
            }
            isInited = true;
            socketInstance.get('/onlineUser/announce', {
                user: $rootScope.userInfo
            }, function (resData, jwres) {
                console.log('socekt post onlineUser', resData);
                $rootScope.myChatSocket = resData;
            });

            // Get the current list of users online.  This will also subscribe us to
            // update and destroy events for the individual users.
            socketInstance.get('/onlineUser', function (resData, jwres) {
                console.log('socekt get onlineUser', resData);
                if (!resData) {
                    return;
                }
                var users = removeMeFromOlineList(resData);
                Array.prototype.push.apply(onlineUsers, users);
                $rootScope.$apply();
            });

            // Get the current list of chat rooms. This will also subscribe us to
            // update and destroy events for the individual rooms.
            socketInstance.get('/room', function (resData, jwres) {
                console.log('socekt get onlineUser', resData);
                if (!resData) {
                    return;
                }
                Array.prototype.push.apply(rooms, resData);
                $rootScope.$apply();
            });

            // Listen for the "room" event, which will be broadcast when something
            // happens to a room we're subscribed to.  See the "autosubscribe" attribute
            // of the Room model to see which messages will be broadcast by default
            // to subscribed sockets.
            socketInstance.on('room', function messageReceived(message) {
                console.log('room socket event', message);
                activeRoom = _.findWhere(rooms, { id: message.id }) || message;
                activeRoom.onlineUsersCount = activeRoom.onlineUsersCount || 0;
                switch (message.verb) {

                    // Handle room creation
                    case 'created':
                        addRoom(message.data);
                        break;

                    // Handle a user joining a room
                    case 'addedTo':
                        // Post a message in the room
                        //postStatusMessage('room-messages-' + message.id, $('#user-' + message.addedId).text() + ' has joined');
                        // Update the room user count
                        //increaseRoomCount(message.id);
                        addUserToRoom(message);
                        break;

                    // Handle a user leaving a room
                    case 'removedFrom':
                        // Post a message in the room
                        //postStatusMessage('room-messages-' + message.id, $('#user-' + message.removedId).text() + ' has left');
                        // Update the room user count
                        //decreaseRoomCount(message.id);
                        removeUserFromRoom(message);
                        break;

                    // Handle a room being destroyed
                    case 'destroyed':
                        removeRoom(message.id);
                        break;

                    // Handle a public message in a room.  Only sockets subscribed to the "message" context of a
                    // Room instance will get this message--see the "join" and "leave" methods of RoomController.js
                    // to see where a socket gets subscribed to a Room instance's "message" context.
                    case 'messaged':
                        receiveRoomMessage(message.data);
                        break;

                    default:
                        break;

                }

            });

            function addRoom(data) {
                activeRoom.onlineUsersCount = 0;
                console.log('inside new room added!!');
                rooms.push(data);
                $rootScope.$apply();
                $rootScope.$broadcast('socket-new-room', data);
            }

            function addUserToRoom(message) {
                activeRoom.onlineUsersCount++;
                $rootScope.$broadcast('socket-room-new-user', message);
            }

            function removeUserFromRoom(message) {
                activeRoom.onlineUsersCount--;
                $rootScope.$broadcast('socket-room-user-removed', message);
            }

            function removeRoom(id) {
                activeRoom.onlineUsersCount = 0;
                $rootScope.$broadcast('socket-room-closed', id);
            }

            function receiveRoomMessage(data) {
                console.log('inside receivePrivateMessage!!', data);
                $rootScope.$broadcast('socket-room-message', data);
            }

            socketInstance.on('onlineuser', function (message) {
                console.log('onlineUser socket event', message);
                switch (message.verb) {

                    // Handle user creation
                    case 'created':
                        addUser(message.data);

                        break;

                    // Handle a user changing their name
                    case 'updated':
                        break;

                    // Handle user destruction
                    case 'destroyed':
                        removeUser(message.id);
                        break;

                    // Handle private messages.  Only sockets subscribed to the "message" context of a
                    // User instance will get this message--see the onConnect logic in config/sockets.js
                    // to see where a new user gets subscribed to their own "message" context
                    case 'messaged':
                        receivePrivateMessage(message.data);
                        break;

                    default:
                        break;
                }

            });

            function addUser(data) {
                console.log('inside new user added!!');
                /* if (data.user.id === $rootScope.userInfo.id) {//let user chat with himself :P
                     return;
                 }*/
                onlineUsers.push(data);
                $rootScope.$apply();
                $rootScope.$broadcast('socket-new-user-online', data);
            }
            function removeUser(id) {
                console.log('inside user removed!!');
                var index = _.findIndex(onlineUsers, { id: id });
                if (index === -1) {
                    console.log('same user detected. Exiting..!!');
                    return;
                }
                console.log('user removed!!');
                onlineUsers.splice(index, 1);
                $rootScope.$apply();
                $rootScope.$broadcast('socket-remove-user-online', id);
            }

            function receivePrivateMessage(data) {
                console.log('inside receivePrivateMessage!!', data);
                $rootScope.$broadcast('socket-private-message', data);
            }

            function removeMeFromOlineList(onlineUsers) {
                var users = [];
                _.each(onlineUsers, function (item) {
                    if (item.user.id !== $rootScope.userInfo.id) {
                        users.push(item);
                    }
                });
                return users;
            }

        }
    }
})();
