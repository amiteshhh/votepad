(function () {
    'use strict';

    var moduleName = 'app.core';

    angular.module(moduleName)
        .controller('AppCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$rootScope', '$injector', '$state', '$stateParams', '$localStorage', '$ionicModal', '$timeout', '$ionicPopup', '$ionicHistory', '$cordovaInAppBrowser', '$cordovaEmailComposer'];
    function Ctrl($scope, $rootScope, $injector, $state, $stateParams, $localStorage, $ionicModal, $timeout, $ionicPopup, $ionicHistory, $cordovaInAppBrowser, $cordovaEmailComposer) {
        var vm = this;
        var OnlineUserSvc = $injector.get('OnlineUserSvc');
        var UpdateUserInfo = $injector.get('UpdateUserInfo');
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

            UpdateUserInfo.updateUserInfo($rootScope.userInfo.id).then(function (data) {
                console.log(data);
                $rootScope.userInfo = $localStorage.userInfo = data;

            }, handleServiceError);
        }

        function handleServiceError(err) {
            console.log('ended with error');
        }

        vm.logout = function () {
            delete $localStorage.userInfo;
            //delete $localStorage.userType;//retain this for next login
            $state.go('auth', { explicitLogout: true });
        };

        vm.toggleUserTypeLogin = function () {
            $rootScope.userType = $localStorage.userType = $localStorage.userType === 'host' ? 'participant' : 'host';
            //$state.go('app.dashboard', {}, { reload: 'app.dashboard' });
            // $state.transitionTo('app.dashboard', {}, {
            //     reload: true, inherit: false, notify: true
            // });
            //$state.reload('app.dashboard');
            vm.routeAndNavClear('app.dashboard');
            iqwerty.toast.Toast('Successfully Logged In as ' + $rootScope.userType);
        };

        var lastChatToId, messages = [];
        function receivePrivateMessage(event, data) {
            console.log('private message', data);
            if (data.event) {//public msg\
                handleEventMessage(data);
                $rootScope.$broadcast('update-event-status', data.event);
                lastChatToId = undefined;
                messages = [];
                return;
            }

            if ($state.current.name === 'app.chat') {
                lastChatToId = undefined;
                messages = [];
                return;
            }
            var incomingChatId = data.from.id;
            if (lastChatToId === incomingChatId) {
                messages.push(data.msg);
                return;
            }
            messages = [data.msg];
            lastChatToId = incomingChatId;

            var confirmPopup = $ionicPopup.confirm({
                title: 'New message from ' + data.from.user.userName,
                template: '<p><strong>Message:</strong> ' + messages.join('\n') + '</p>' + 'Do You want to chat?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    var msg = messages.length === 1 ? messages[0] : messages.length + ' messages received -' + messages.join(', ');
                    $state.go('app.chat', { chatTo: data.from, msg: msg });
                    lastChatToId = undefined;
                    messages = [];
                } else {
                    console.log('You are not sure');
                }
            });
        }
        $rootScope.eventsInProgress = [];
        function handleEventMessage(data) {
            var event = data.event, msg = data.msg;

            var isAlreadyNotified = _.contains($rootScope.eventsInProgress, event.id);//event.id !== $stateParams.id && 
            /*if ($state.current.name !== 'app.poll' && $rootScope.userInfo.id === event.eventHostedBy.id) {//owner
                iqwerty.toast.Toast('New response received for event - ' + event.title);
            }*/
            if (/*$localStorage.userType === 'host' && */$state.current.name !== 'app.poll' && $rootScope.userInfo.id === event.eventHostedBy.id) {
                iqwerty.toast.Toast('New response received for event - ' + event.title);
                return;
            }

            if ($localStorage.userType === 'host' || isAlreadyNotified || $state.current.name === 'app.poll') {//if participant you may show this
                //iqwerty.toast.Toast('New response received for event ' + event.title);
                return;
            }

            $rootScope.eventsInProgress.push(event.id);

            var confirmPopup = $ionicPopup.confirm({
                title: 'A new poll just started for event - ' + event.title,
                template: 'Do You want to participate?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var routeData = {/*
                eventModel: item,*/
                        id: event.id,
                        userType: $localStorage.userType
                    };
                    $state.go('app.poll', routeData);

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

        vm.routeAndNavClear = function (state) {
            $state.go(state);
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        };

        vm.openEXternalUrl = function (url, target) {
            target = target || '_system';
            $cordovaInAppBrowser.open(url, target);
        };

        vm.sendMail = function (email) {
            if (typeof cordova === 'undefined') {
                sendMailViaBrowser(email);
                return;
            }
            $cordovaEmailComposer.isAvailable().then(function () {
                sendMailViaNative(email);
            }, function () {
                //https://github.com/katzer/cordova-plugin-email-composer/issues/177
                //isAvailable return false on API Level 23 #17
                sendMailViaNative(email, true);
            });
        };

        function sendMailViaNative(email, isNotAvailable) {
            email = {
                to: email.to,
                cc: email.cc,
                bcc: email.bcc,
                attachments: email.attachments,
                subject: email.subject,
                body: email.body,
                isHtml: email.isHtml
            };

            $cordovaEmailComposer.open(email).then(null, function () {
                var msg = isNotAvailable ?
                    'Error: Unable to send mail. Ensure that you have configured email account in your device.'
                    : 'Error: Unable to send mail.';

                iqwerty.toast.Toast(msg);
            });
        }

        function sendMailViaBrowser(email) {//basic feature supported
            var mailUrl = "mailto:" + email.to;
            mailUrl += "?cc=" + (email.cc || '');
            mailUrl += "&bcc=" + (email.bcc || '');
            mailUrl += '&subject=' + encodeURIComponent(email.subject || '');
            mailUrl += '&body=' + encodeURIComponent(email.body || '');
            vm.openEXternalUrl(mailUrl, '_self');
        }

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