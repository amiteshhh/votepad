(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$scope', '$ionicModal', '$ionicPopup', '$timeout', '$localStorage'];
    function CreateEventCtrl($scope, $ionicModal, $ionicPopup, $timeout, $localStorage) {
        var vm = this;

        vm.singleSelectOptions = [];
        vm.showSingleSelectOptionDelete = false;

        vm.multipleSelectOptions = [];
        vm.showMultipleSelectOptionDelete = false;

        if (!$localStorage.eventData) {
            $localStorage.eventData = [];
        }

        var eventData = {};

        //--------------------------------- SINGLE SELECT -----------------------------------

        vm.configureSingleSelect = function () {

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-single-select-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.singleSelectModal = modal;
                modal.show();
            });
        };

        vm.addSingleSelectOption = function () {

            var optionItem = {
                index: vm.singleSelectOptions.length + 1,
                value: vm.option
            };
            vm.singleSelectOptions.push(optionItem);
            optionItem = {};
            vm.option = '';
            vm.showSingleSelectOptionDelete = false;
        };

        vm.deleteSingleSelectOption = function (item) {
            vm.singleSelectOptions.splice(item, 1);

            for (var i = 0; i < vm.singleSelectOptions.length; i++) {
                vm.singleSelectOptions[i].index = i + 1;
            };
        };

        vm.backFromSingleSelect = function () {
            vm.singleSelectEventName = '';
            vm.singleSelectQuestion = '';
            vm.singleSelectOptions = [];
            if (!eventData.eventType) {
                eventData.eventType = 3;
            }
            vm.singleSelectModal.hide();
        };

        vm.singleScaleEventConfigured = function () {
            eventData = {
                eventType: 3,
                eventTypeDetail: 'Single Select',
                eventName: vm.singleSelectEventName,
                eventQues: vm.singleSelectQuestion,
                eventOptions: vm.singleSelectOptions
            };
            $localStorage.eventData.push(eventData);
            vm.singleSelectEventName = '';
            vm.singleSelectQuestion = '';
            vm.singleSelectOptions = [];
            vm.singleSelectModal.hide();
        };
        // -------------------------------------------------------------------

        //--------------------------------- LINEAR SCALE -----------------------------------

        vm.showRangeError = false;

        vm.configureLinearScale = function () {

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-linear-scale-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.linearScaleModal = modal;
                modal.show();
            });
        };

        vm.addLinearScaleRange = function () {
            if (vm.rateRange > 10 || vm.rateRange < 1) {
                vm.showRangeError = true;
                vm.rateRangeArray = [];
                return;
            }
            vm.showRangeError = false;
            vm.rateRangeArray = [];
            for (var i = 1; i <= vm.rateRange; i++) {
                vm.rateRangeArray.push(i);
            };
            console.log(vm.rateRangeArray);
        };

        vm.backFromLinearScale = function () {
            vm.linearScaleEventName = '';
            vm.linearScaleQuestion = '';
            vm.rateRange = '';
            vm.rateRangeArray = [];
            if (!eventData.eventType) {
                eventData.eventType = 4;
            }
            vm.linearScaleModal.hide();
        };

        vm.linearScaleEventConfigured = function () {
            eventData = {
                eventType: 4,
                eventTypeDetail: 'Linear Scale',
                eventName: vm.linearScaleEventName,
                eventQues: vm.linearScaleQuestion,
                eventRange: vm.rateRangeArray
            };
            $localStorage.eventData.push(eventData);
            vm.linearScaleEventName = '';
            vm.linearScaleQuestion = '';
            vm.rateRange = '';
            vm.rateRangeArray = [];
            vm.linearScaleModal.hide();
        };

        // -------------------------------------------------------------------

        //--------------------------------- MULTIPLE SELECT -----------------------------------

        vm.configureMultipleSelect = function () {

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-multiple-select-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.multipleSelectModal = modal;
                modal.show();
            });
        };

        vm.addMultipleSelectOption = function () {
            var optionItem = {
                index: vm.multipleSelectOptions.length + 1,
                value: vm.option2
            };
            vm.multipleSelectOptions.push(optionItem);
            optionItem = {};
            vm.option2 = '';
            vm.showMultipleSelectOptionDelete = false;
        };

        vm.deleteMultiplSelectOption = function (item) {
            vm.multipleSelectOptions.splice(item, 1);

            for (var i = 0; i < vm.multipleSelectOptions.length; i++) {
                vm.multipleSelectOptions[i].index = i + 1;
            };
        };

        vm.backFromMultipleSelect = function () {
            vm.multipleSelectEventName = '';
            vm.multipleSelectQuestion = '';
            vm.multipleSelectOptions = [];
            if (!eventData.eventType) {
                eventData.eventType = 5;
            }
            vm.multipleSelectModal.hide();
        };

        vm.multipleSelectEventConfigured = function () {
            eventData = {
                eventType: 5,
                eventTypeDetail: 'Multiple Select',
                eventName: vm.multipleSelectEventName,
                eventQues: vm.multipleSelectQuestion,
                eventOptions: vm.multipleSelectOptions
            };
            $localStorage.eventData.push(eventData);
            vm.multipleSelectEventName = '';
            vm.multipleSelectQuestion = '';
            vm.multipleSelectOptions = [];
            vm.multipleSelectModal.hide();
        };

        // -------------------------------------------------------------------

        //--------------------------------- YES/NO SELECT -----------------------------------

        vm.configureYesNo = function () {

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-yes-no-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.yesNoModal = modal;
                modal.show();
            });
        };

        vm.backFromYesNo = function () {
            vm.yesNoEventName = '';
            vm.yesNoQuestion = '';
            if (!eventData.eventType) {
                eventData.eventType = 2;
            }
            vm.yesNoModal.hide();
        };

        vm.yesNoEventConfigured = function () {
            eventData = {
                eventType: 2,
                eventTypeDetail: 'Yes/No',
                eventName: vm.yesNoEventName,
                eventQues: vm.yesNoQuestion
            };
            $localStorage.eventData.push(eventData);
            vm.yesNoEventName = '';
            vm.yesNoQuestion = '';
            vm.yesNoModal.hide();
        };
        // -------------------------------------------------------------------

        //--------------------------------- TEXT -----------------------------------

        vm.configureText = function () {

            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-text-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.textModal = modal;
                modal.show();
            });
        };

        vm.backFromText = function () {
            vm.textEventName = '';
            vm.textQuestion = '';
            if (!eventData.eventType) {
                eventData.eventType = 1;
            }
            vm.textModal.hide();
        };

        vm.textEventConfigured = function () {
            eventData = {
                eventType: 1,
                eventTypeDetail: 'Textual',
                eventName: vm.textEventName,
                eventQues: vm.textQuestion
            };
            $localStorage.eventData.push(eventData);
            vm.textEventName = '';
            vm.textQuestion = '';
            vm.textModal.hide();
        };
        // -------------------------------------------------------------------

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            switch (eventData.eventType) {
                case 1:
                    vm.textModal.remove();
                    break;
                case 2:
                    vm.yesNoModal.remove();
                    break;
                case 3:
                    vm.singleSelectModal.remove();
                    break;
                case 4:
                    vm.linearScaleModal.remove();
                    break;
                case 5:
                    vm.multipleSelectModal.remove();
                    break;

            }
        });

    }
})();
