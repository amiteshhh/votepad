(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$injector', '$ionicModal', '$localStorage', '$state', '$ionicHistory'];
    function DashboardCtrl($scope, $rootScope, $injector, $ionicModal, $localStorage, $state, $ionicHistory) {
        var DashboardSvc = $injector.get('DashboardSvc');
        var UpdateUserInfo = $injector.get('UpdateUserInfo');
        var EventSvc = $injector.get('EventSvc');
        var vm = this;

        //vm.labels = ["Open Events", "Closed Events", "Not started"];
        //vm.data = [6, 8, 10];

        vm.isParticipatedEvents = true;
        vm.isHostedEvents = true;

        vm.showParticipatedEventDetails = function () {
            vm.isParticipatedEvents = !vm.isParticipatedEvents;
        };

        vm.showHostedEventDetails = function () {
            vm.isHostedEvents = !vm.isHostedEvents;
        };

        init();

        function init() {
            //_find();
            _updateUserInfo();
            _hostedEvents($rootScope.userInfo.eventsHosted);
            _participatedEvents($rootScope.userInfo.eventsParticipated);
        }

        function _hostedEvents(id) {
            EventSvc.fetchEvents(id).then(function (data) {
                console.log("Hosted Data ---------- ");
                console.log(data);
                vm.hostedData = data;
                _createHostedEventArray(data);
            }, handleServiceError);
        }

        function _createHostedEventArray(data) {
            vm.hostedEvents = [];
            vm.hostedTextualData = [];
            _.each(data, function (item) {

                if (item.templateType === 'text') {
                    var textEvent = {
                        title: item.title,
                        createdBy: item.eventHostedBy.userName,
                        createdOn: item.eventHostedBy.createdAt,
                        status: item.eventStatus,
                        participantsCount: item.eventParticipants.length,
                        eventLikedBy: item.eventLikedBy
                    };
                    vm.hostedTextualData.push(textEvent);
                    return;
                }
                var event = {
                    title: item.title,
                    createdBy: item.eventHostedBy.userName,
                    createdOn: item.eventHostedBy.createdAt,
                    status: item.eventStatus,
                    participantsCount: item.eventParticipants.length,
                    eventLikedBy: item.eventLikedBy,
                    optLabels: [],
                    optData: []
                };
                _.each(item.optionTemplate.options, function (i) {
                    event.optLabels.push(i.label);
                    event.optData.push(i.optionRespondedBy.length);
                });
                vm.hostedEvents.push(event);

            });

            console.log("Hosted Filtered Data");
            console.log(vm.hostedEvents);
            console.log("Hosted Textual Filtered Data");
            console.log(vm.hostedTextualData);

        }

        vm.assignEventStatus = function (eventStatus) {
            if (eventStatus === 'created') {
                return 'myEnerzized';
            } else if (eventStatus === 'open') {
                return 'myBalanced';
            } else if (eventStatus === 'closed') {
                return 'myAssertive';
            }
        };

        function _participatedEvents(id) {
            EventSvc.fetchEvents(id).then(function (data) {
                console.log("Participated Data ---------- ");
                console.log(data);
                vm.participatedData = data;
                _createParticipatedEventArray(data);
            }, handleServiceError);
        }

        function _createParticipatedEventArray(data) {
            vm.participatedEvents = [];
            vm.participatedTextualData = [];
            _.each(data, function (item) {

                if (item.templateType === 'text') {
                    var textEvent = {
                        title: item.title,
                        createdBy: item.eventHostedBy.userName,
                        createdOn: item.eventHostedBy.createdAt,
                        status: item.eventStatus,
                        participantsCount: item.eventParticipants.length,
                        eventLikedBy: item.eventLikedBy
                    };
                    vm.participatedTextualData.push(textEvent);
                    return;
                }
                var event = {
                    title: item.title,
                    createdBy: item.eventHostedBy.userName,
                    createdOn: item.eventHostedBy.createdAt,
                    status: item.eventStatus,
                    participantsCount: item.eventParticipants.length,
                    eventLikedBy: item.eventLikedBy,
                    optLabels: [],
                    optData: []
                };
                _.each(item.optionTemplate.options, function (i) {
                    event.optLabels.push(i.label);
                    event.optData.push(i.optionRespondedBy.length);
                });
                vm.participatedEvents.push(event);
            });

            console.log("Participated Filtered Data");
            console.log(vm.participatedEvents);
            console.log("Participated Textual Filtered Data");
            console.log(vm.participatedTextualData);
        }

        function _updateUserInfo() {
            UpdateUserInfo.updateUserInfo($rootScope.userInfo.id).then(function (data) {
                console.log(data);
                $rootScope.userInfo = $localStorage.userInfo = data;

            }, handleServiceError);
        }

        function handleServiceError(err) {
            console.log('ended with error');
        }

        vm.createEvent = function () {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('app.createEvent');
        };

        vm.showRespondedUsersList = function (users) {
            if (!users || !users.length) {
                return;
            }
            $rootScope.$broadcast('showUsersList', users);
        };

    }
})();
