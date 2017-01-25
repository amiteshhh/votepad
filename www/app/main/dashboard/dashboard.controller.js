(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$injector', '$ionicModal', '$localStorage', '$state', '$ionicHistory', $q];
    function DashboardCtrl($scope, $rootScope, $injector, $ionicModal, $localStorage, $state, $ionicHistory, $q) {
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
        }

        function _updateUserInfo() {
            UpdateUserInfo.updateUserInfo($rootScope.userInfo.id).then(function (data) {
                console.log(data);
                $rootScope.userInfo = $localStorage.userInfo = data;

                var deferred = $q.defer();
                var promises = [];

                promises.push(_hostedEvents($rootScope.userInfo.eventsHosted));
                promises.push(_participatedEvents($rootScope.userInfo.eventsParticipated));

                $q.all(promises).finally(function () {
                    vm.hideSpinner = true;
                });

            }, function () {
                handleServiceError();
                vm.hideSpinner = true;
            });
        }

        function _hostedEvents(events) {
            return EventSvc.fetchEvents(events).then(function (data) {
                _processEventsForDashboard(data, 'host');
            }, handleServiceError);
        }

        function _participatedEvents(events) {
            return EventSvc.fetchEvents(events).then(function (data) {
                _processEventsForDashboard(data, 'participant');
            }, handleServiceError);
        }

        function _processEventsForDashboard(data, role) {
            var events = [], textualEvents = [];
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
                    textualEvents.push(textEvent);
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
                events.push(event);

            });

            if (role === 'host') {
                vm.hostedEvents = events;
                vm.hostedTextualEvents = textualEvents;
            } else {
                vm.participatedEvents = events;
                vm.participatedTextualEvents = textualEvents;
            }

            console.log("Dashboard Data For " + role);
            console.log("Filtered Data", events);
            console.log("Hosted Textual Filtered Data", textualEvents);

        }

        vm.assignEventStatus = function (eventStatus) {
            if (eventStatus === 'created') {
                return 'myEnerzized';
            }
            if (eventStatus === 'open') {
                return 'myBalanced';
            }
            if (eventStatus === 'closed') {
                return 'myAssertive';
            }
        };

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

        function handleServiceError(err) {
            console.log('ended with error');
            iqwerty.toast.Toast('Errors occured with service');
        }

    }
})();
