(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$scope', '$ionicModal', '$ionicPopup', '$timeout'];
    function CreateEventCtrl($scope, $ionicModal, $ionicPopup, $timeout) {
        var vm = this;

        vm.singleSelectOptions = [];
        vm.showInbuiltQues = true;
        vm.showCustomQues = true;
        var question;

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
            /*f (!vm.question) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Field Required!',
                    template: 'Please enter a valid question.'
                });
                return;
            }*/

            vm.previewQuestion = vm.question;

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-single-select-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configSingleSelect = modal;
                modal.show();
            });
        };

        vm.reconfigureEvent = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/reconfigure-event-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configSingleSelect = modal;
                modal.show();
            });
        };

        vm.singleSelectConfigDone = function () {
            vm.question = '';
            vm.showInbuiltQues = false;
            vm.showCustomQues = false;
            vm.configSingleSelect.hide();
            console.log(vm.singleSelectOptions);
        };

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
