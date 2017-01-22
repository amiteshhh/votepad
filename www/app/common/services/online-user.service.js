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
        var onlineUsers = [];
        var isInited = false;
        return {
            init: _init,
            onlineUsers: onlineUsers
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
            });

            // Get the current list of users online.  This will also subscribe us to
            // update and destroy events for the individual users.
            socketInstance.get('/onlineUser', function (resData, jwres) {
                console.log('socekt get onlineUser', resData);
                if(!resData){
                    return;
                }
                Array.prototype.push.apply(onlineUsers, resData);
                $rootScope.$apply();
            });
            socketInstance.on('onlineuser', function (message) {
                //console.log('22222222socekt get onlineUser', message);
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
                console.log('new user added!!');
                onlineUsers.push(data);
                $rootScope.$apply();
                $rootScope.$broadcast('socket-new-user-online', data);
            }
            function removeUser(id) {
                console.log('user removed!!');
                onlineUsers.splice(_.findIndex(onlineUsers, { id: id }), 1);//addUser(message.data);
                $rootScope.$apply();
                $rootScope.$broadcast('socket-remove-user-online', id);
            }

            function receivePrivateMessage() {

            }

        }
    }
})();
