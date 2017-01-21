(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$state'];
    function CreateEventCtrl($state) {
        var vm = this;

        vm.configureSingleSelect = function () {
            var routeData = {
                templateType: 'singleSelect'
            }
            $state.go('app.editEvent', routeData);
        };

        vm.configureLinearScale = function () {
            var routeData = {
                templateType: 'range'
            }
            $state.go('app.editEvent', routeData);
        };

        vm.configureMultipleSelect = function () {
            var routeData = {
                templateType: 'multiSelect'
            }
            $state.go('app.editEvent', routeData);
        };

        vm.configureYesNo = function () {
            var routeData = {
                templateType: 'yesNo'
            }
            $state.go('app.editEvent', routeData);
        };

        vm.configureText = function () {
            var routeData = {
                templateType: 'text'
            }
            $state.go('app.editEvent', routeData);
        };


    }
})();
