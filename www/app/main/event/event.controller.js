(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .controller('EventCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope'];
    function Ctrl($injector, $rootScope) {
        var vm = this;
        var EventSvc = $injector.get('EventSvc');
        init();

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
