(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .controller('EventCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope', '$scope', '$ionicModal'];
    function Ctrl($injector, $rootScope, $scope, $ionicModal) {
        var vm = this;
        var EventSvc = $injector.get('EventSvc');

        init();

        vm.viewDetail = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/event-detail-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.modal = modal;
                modal.show();
            });
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            vm.modal.remove();
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
