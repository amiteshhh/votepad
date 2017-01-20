(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .controller('EventCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope', '$scope', '$ionicModal', '$localStorage'];
    function Ctrl($injector, $rootScope, $scope, $ionicModal, $localStorage) {
        var vm = this;
        var EventSvc = $injector.get('EventSvc');

        vm.eventsData = $localStorage.eventData ? $localStorage.eventData : [];

        init();

        vm.viewDetail = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/event-detail-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.eventDetailModal = modal;
                modal.show();
            });
        };

        vm.backToRegisteredEvents = function () {
            vm.eventDetailModal.hide();
        };

        vm.likedBy = [{
            person: 'Pratik Anand'
        },
        {
            person: 'Saurav Sahoo'
        },
        {
            person: 'Amitesh Kumar'
        },
        {
            person: 'Haunshila Yadav'
        },
        {
            person: 'Amit Tiwary'
        },
        {
            person: 'Soham Paul'
        }];

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

        vm.showLikesData = function () {
            vm.likesModal.show();
        }

        vm.goBackToPoll = function () {
            vm.likesModal.hide();
        }

        // Execute action on hide modal
        $scope.$on('vm.likesModal.hidden', function () {
            vm.likesModal.remove();
        });

        $scope.$on('vm.eventDetailModal.hidden', function () {
            vm.eventDetailModal.remove();
        });

        function init() {
            _find();
        }
        function _find() {
            EventSvc.find().then(function (data) {
                vm.events = data;
            }, handleServiceError);
        }

        vm.onItemClick = function (item) {
            vm.event = item;
        };

        vm.createOrUpdate = function () {
            EventSvc.createOrUpdate(vm.event).then(function (data) {
                vm.event = data;
            }, handleServiceError);
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }
    }
})();
