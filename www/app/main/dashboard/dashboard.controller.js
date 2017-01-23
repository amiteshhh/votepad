(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$injector', '$ionicModal', '$localStorage', '$state', '$ionicHistory'];
    function DashboardCtrl($scope, $injector, $ionicModal, $localStorage, $state, $ionicHistory) {
        var DashboardSvc = $injector.get('DashboardSvc');
        var vm = this;
        vm.labels = ["Open Events", "Closed Events", "Events yet to be started"];
        vm.data = [];

        init();

        function init() {
            _find();
        }

        function _find() {
            DashboardSvc.find().then(function (data) {
                vm.events = data;
                console.log(vm.events);
                vm.openEvents = _.filter(vm.events, function (item) {
                    return item.eventStatus === 'open';
                });
                vm.data.push(vm.openEvents.length);

                console.log(vm.openEvents);

                vm.closedEvents = _.filter(vm.events, function (item) {
                    return item.eventStatus === 'closed';
                });
                vm.data.push(vm.closedEvents.length);

                console.log(vm.closedEvents);

                vm.createdEvents = _.filter(vm.events, function (item) {
                    return item.eventStatus === 'created';
                });
                vm.data.push(vm.createdEvents.length);

                console.log(vm.createdEvents);

            }, handleServiceError);

        }

        function handleServiceError(err) {
            console.log('ended with error');
        };


        vm.createEvent = function () {
            $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
            $state.go('app.createEvent');
        }

    }
})();
