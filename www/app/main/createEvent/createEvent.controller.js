(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$scope', '$ionicModal'];
    function CreateEventCtrl($scope, $ionicModal) {
        var vm = this;

        vm.singleSelectOptions = [];
        vm.activeItem = {};

        vm.openResponseFormat = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-question-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configQues = modal;
                modal.show();
            });
        };

        vm.configureSingleSelect = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-single-select-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configSingleSelect = modal;
                modal.show();
            });
        };

        vm.singleSelectConfigDone = function () {
            vm.configSingleSelect.hide();
            console.log(vm.singleSelectOptions);
            vm.activeItem.singleSelect = true;
            console.log(vm.activeItem);
        }

        vm.addOptionForSingleSelect = function () {
            vm.optionItem = {
                index: vm.singleSelectOptions.length + 1,
                value: vm.option
            };
            vm.singleSelectOptions.push(vm.optionItem);
            vm.optionItem = {};
            vm.option = '';
            console.log(vm.singleSelectOptions);
        };

        vm.backFromSingleSelect = function () {
            vm.configSingleSelect.hide();
        };

        vm.backFromConfigQues = function () {
            vm.configQues.hide();
        };

    }
})();
