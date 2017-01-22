(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.editEvent.EditEventCtrl:EditEventCtrl
     *
     * @description
     * EditEventCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.editEvent';

    angular.module(moduleName)
        .controller('EditEventCtrl', Ctrl);

    Ctrl.$inject = ['$scope', '$state', '$stateParams', '$injector', '$rootScope', '$localStorage', '$timeout', '$ionicLoading', '$ionicViewService'];
    function Ctrl($scope, $state, $stateParams, $injector, $rootScope, $localStorage, $timeout, $ionicLoading, $ionicViewService) {
        var vm = this;
        var EditEventSvc = $injector.get('EditEventSvc');

        var templateType = $stateParams.templateType;
        vm.event = $stateParams.eventModel || {};
        vm.event.templateType = templateType;
        vm.createOptionsForLinearRange = createOptionsForLinearRange;

        init();

        function init() {
            setModalTemplate();
            if (templateType === 'text') {
                if (!vm.event.textTemplates || !vm.event.textTemplates.length) {
                    initTextTemplate();
                }
            } else {
                if (!vm.event.optionTemplates || !vm.event.optionTemplates.length) {                    
                    initOptionTemplate();
                }
                vm.event.optionTemplate = vm.event.optionTemplate || vm.event.optionTemplates[0];//not working

                if (templateType === 'range') {
                    vm.createOptionsForLinearRange();
                }
            }
            console.log(vm.event);
        }

        function initTextTemplate() {
            vm.event.textTemplates = [{
                cssId: 'Q1',
                question: '',
                textTemplateCreatedBy: $rootScope.userInfo.id
            }];
        }

        function initOptionTemplate() {
            var optionTemplate = {};
            if (templateType === 'yesNo') {
                optionTemplate.options = [{
                    cssId: 'Q1',
                    label: 'Yes'
                },
                {
                    cssId: 'Q2',
                    label: 'No'
                }];
            } else if (templateType === 'singleSelect' || templateType === 'multiSelect') {
                optionTemplate.options = [{
                    cssId: 'Q1',
                    label: ''
                }];
            }
            else if (templateType === 'range') {
                optionTemplate.lowerRange = "1";
                optionTemplate.upperRange = "10";
            }
            vm.event.optionTemplates = [optionTemplate];
        }
        function setModalTemplate() {
            if (templateType === 'text') {
                vm.tempalteLocation = '/app/main/common/templates/configure-text-modal-template.html';
            }
            else if (templateType === 'yesNo') {
                vm.tempalteLocation = '/app/main/common/templates/configure-single-select-modal-template.html';
            }
            else if (templateType === 'singleSelect') {
                vm.tempalteLocation = '/app/main/common/templates/configure-single-select-modal-template.html';
            }
            else if (templateType === 'multiSelect') {
                vm.tempalteLocation = 'app/main/common/templates/configure-multiple-select-modal-template.html';
            }
            else if (templateType === 'range') {
                vm.tempalteLocation = 'app/main/common/templates/configure-linear-scale-modal-template.html';
            }
        }

        //For Text
        vm.addQueToTextTemplates = function (items) {
            var textQuesArrayLength = items.length + 1;
            var tempTextQuest = {
                cssId: 'Q' + textQuesArrayLength,
                question: '',
                textTemplateCreatedBy: $rootScope.userInfo.id
            };
            items.push(tempTextQuest);
            $timeout(function () {
                document.querySelector('#' + tempTextQuest.cssId).select();
            }, 50, false);
            console.log(vm.event);

        };

        //Same for others too
        vm.deleteQueFromTextTemplates = function (item, items) {
            items.splice(items.indexOf(item), 1);
            console.log(vm.event);

        };

        //For Text
        vm.validateLaunchPoll = function () {
            if (!vm.event.title || _.filter(vm.event.textTemplates, function (item) {
                return item.question === '';
            }).length !== 0) {
                return true;
            }

        };

        //Same for others too
        vm.createOrUpdateEvent = function () {
            $ionicLoading.show();
            EditEventSvc.createOrUpdate(templateType, vm.event).then(function (response) {
                $state.go('app.event');
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
            }).catch(handleServiceError).finally($ionicLoading.hide);

        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }

        //Same for Yes/No, singleSelect, multiSelect
        vm.addOptToOptTemplates = function (items) {
            var OptionsArrayLength = items.length + 1;
            var option = {
                cssId: 'Q' + OptionsArrayLength,
                label: ''
            };
            items.push(option);
            $timeout(function () {
                document.querySelector('#' + option.cssId).select();
            }, 50, false);
            console.log(vm.event);
        };

        //Same for Yes/No, singleSelect, multiSelect, linearRange
        vm.defaultValidateLaunchPoll = function () {
            if (!vm.event.title || !vm.event.optionTemplates[0].question || _.filter(vm.event.optionTemplates[0].options, function (item) {
                return item.label === '';
            }).length !== 0) {
                return true;
            }
        };

        function createOptionsForLinearRange() {
            var lowerRange = parseInt(vm.event.optionTemplate.lowerRange, 10);
            var upperRange = parseInt(vm.event.optionTemplate.upperRange, 10);
            var options = [];
            for (var i = lowerRange; i <= upperRange; i++) {
                var option = {
                    label: i
                };
                options.push(option);
            }
            vm.event.optionTemplate.options = options;
        }

    }
})();

