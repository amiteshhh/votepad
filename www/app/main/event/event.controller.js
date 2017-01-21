(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .controller('EventCtrl', Ctrl);

    Ctrl.$inject = ['$state', '$injector', '$rootScope', '$scope', '$ionicModal', '$localStorage', '$ionicLoading'];
    function Ctrl($state, $injector, $rootScope, $scope, $ionicModal, $localStorage, $ionicLoading) {
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
                console.log(vm.events);
            }, handleServiceError);
        }

        vm.onItemDelete = function(item) {
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
            var routeData = {
                templateType: item.templateType,
                eventModel: item
            };
            $state.go('app.editEvent', routeData);
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
