(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .controller('EventCtrl', Ctrl);

    Ctrl.$inject = ['$state', '$injector', '$rootScope', '$scope', '$ionicModal', '$localStorage', '$ionicLoading', '$ionicPopup', '$timeout'];
    function Ctrl($state, $injector, $rootScope, $scope, $ionicModal, $localStorage, $ionicLoading, $ionicPopup, $timeout) {
        var vm = this;
        var EventSvc = $injector.get('EventSvc');

        vm.showDelete = false;

        init();

        function init() {
            _find();
        }
        function _find() {
            EventSvc.find().then(function (data) {
                vm.events = data;
                _.each(vm.events, function (item) {
                    assignEventAction(item);
                });
                console.log(vm.events);
            }, handleServiceError);
        }

        function assignEventAction(item) {
            // _.each(vm.events, function (item) {
            var action;
            var isOwner = item.eventHostedBy.id === $rootScope.userInfo.id;
            if (item.eventStatus === 'created' && isOwner) {
                if ($rootScope.userType === 'host') {
                    action = 'Launch Poll';
                } /*else {
                        action = 'Edit Poll';
                    }*/
            } else if (item.eventStatus === 'closed' && isOwner) {
                action = 'View Response';
            }
            else if (item.eventStatus === 'open') {
                if (isOwner) {
                    action = 'View Response';
                } else {
                    if ($rootScope.userType === 'host') {
                        action = 'View Response';
                    } else {
                        action = 'Join Poll';
                    }
                }
            }
            item.action = action;
            //});

        }

        vm.onItemDelete = function (item) {
            $ionicLoading.show();
            vm.events.splice(vm.events.indexOf(item), 1);
            EventSvc.destroy(item.id).then(function (data) {
                $ionicLoading.hide();
                console.log("Event deleted successfully");
            }, handleServiceError);
        };

        vm.createOrUpdate = function () {
            EventSvc.createOrUpdate(vm.event).then(function (data) {
                vm.events = data;
            }, handleServiceError);
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }

        vm.assignEventStatus = function (eventStatus) {
            if (eventStatus === 'created') {
                return 'energized';
            } else if (eventStatus === 'open') {
                return 'balanced';
            } else if (eventStatus === 'closed') {
                return 'assertive';
            }
        };

        vm.viewDetail = function (item, $event) {
            var routeData = {/*
                eventModel: item,*/
                id: item.id,
                userType: $localStorage.userType
            };
            if ($event) {
                $event.stopPropagation();
                $state.go('app.poll', routeData);
                return;
            }
            if (item.eventStatus === 'created') {
                if (item.eventHostedBy.id === $rootScope.userInfo.id) {
                    $state.go('app.editEvent', routeData);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Event not yet started !',
                        template: "Please wait till event creator starts this event"
                    });
                    $timeout(function () {
                        alertPopup.close(); //close the popup after 3 seconds for some reason
                    }, 5000);
                }
            }

            if (item.eventStatus === 'open') {
                $state.go('app.poll', routeData);
            }

            if (item.eventStatus === 'closed') {
                if ($localStorage.userType === 'host') {
                    $state.go('app.poll', routeData);
                }

                if ($localStorage.userType === 'participant') {
                    var eventCloseAlertPopup = $ionicPopup.alert({
                        title: 'Event is closed !',
                        template: "You cannot send your response for this event anymore."
                    });
                    $timeout(function () {
                        eventCloseAlertPopup.close();
                    }, 5000);
                }
            }
        };

        vm.likesModal = $ionicModal.fromTemplate(
            '<ion-modal-view>' +
            '<ion-header-bar class="bar-positive">' +
            '<button class="button button-icon icon ion-android-arrow-back" ng-click="vm.goBackToPoll()"></button>' +
            '<h1 class="title">People who liked</h1>' +
            '</ion-header-bar>' +
            '<ion-content>' +
            '<div class="list">' +
            '<div class="item" ng-repeat="item in vm.likedBy">{{item.person}}</div>' +
            '</ion-content>' +
            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            });


        $scope.$on('update-event-status', function (event, data) {
            console.log('update', data);
            var notify, matchedEvent = _.find(vm.events, function (item) {
                return item.id === data.id;
            });
            if (matchedEvent) {//&& item.eventStatus !== data.eventStatus && item.status === 'created'
                if(item.status === 'created'){
                    matchedEvent.status = 'open';
                    matchedEvent.action = 'Join Poll';
                    notify = true;
                }
            }else{
                vm.events.unshift(data);
                data.action = 'Join Poll';
                notify = true;
            }

            if(!notify){
                return;
            }
            
            var confirmPopup = $ionicPopup.confirm({
                title: 'A new poll just started for event - ' + data.title,
                template: 'Do You want to participate?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    vm.viewDetail(matchedEvent);
                } else {
                    console.log('You are not sure');
                }
            });
        });
    }
})();
