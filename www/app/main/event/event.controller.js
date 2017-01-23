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
        if(!$rootScope.userType) {
            $rootScope.userType = ($localStorage.userType === 'host' ? true : false); 
        }

        init();

        function init() {
            _find();
        }
        function _find() {
            EventSvc.find().then(function (data) {
                vm.events = data;
                console.log(vm.events);
            }, handleServiceError);
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

        vm.viewDetail = function (item) {
            
            if (item.eventStatus === 'created') {
                if ($localStorage.userType === 'host') {
                    var routeData = {
                        templateType: item.templateType,
                        eventModel: item
                    };
                    $state.go('app.editEvent', routeData);
                };

                if ($localStorage.userType === 'participant') {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Event not yet started !',
                        template: "Please wait till event creator starts this event"
                    });
                    $timeout(function () {
                        alertPopup.close(); //close the popup after 3 seconds for some reason
                    }, 5000);
                };

            };

            if (item.eventStatus === 'open') {
                var routeData = {
                    eventModel: item,
                    userType: $localStorage.userType
                };
                $state.go('app.poll', routeData);

            };

            if (item.eventStatus === 'closed') {
                if ($localStorage.userType === 'host') {
                    var routeData = {
                        templateType: item.templateType,
                        eventModel: item
                    };
                    $state.go('app.poll', routeData);
                };

                if ($localStorage.userType === 'participant') {
                    var eventCloseAlertPopup = $ionicPopup.alert({
                        title: 'Event is closed !',
                        template: "You cannot send your response for this event anymore."
                    });
                    $timeout(function () {
                        eventCloseAlertPopup.close();
                    }, 5000);
                };
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
    }
})();
