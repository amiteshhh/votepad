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

        init();

        function init() {
            if (templateType === 'text') {
                vm.tempalteLocation = '/app/main/common/templates/configure-text-modal-template.html';
                if (!vm.event.textTemplates) {
                    vm.event.textTemplates = [{
                        cssId: 'Q1',
                        question: '',
                        textTemplateCreatedBy: $rootScope.userInfo.id
                    }];
                }
            } else if (templateType === 'yesNo') {
                vm.tempalteLocation = 'app/main/common/templates/configure-yes-no-modal-template.html';
                if (!vm.event.optiontemplates) {
                    vm.event.optiontemplates = [{
                        options: [{
                            cssId: 'Q1',
                            label: 'Yes'
                        },
                        {
                            cssId: 'Q2',
                            label: 'No'
                        }]
                    }];
                }
            } else if (templateType === 'singleSelect') {
                vm.tempalteLocation = 'app/main/common/templates/configure-single-select-modal-template.html';
                if (!vm.event.optiontemplate.options) {
                    vm.event.optiontemplate.options = [{
                        cssId: 'Q1',
                        label: ''
                    }];
                }
            } else if (templateType === 'multiSelect') {
                vm.tempalteLocation = 'app/main/common/templates/configure-multiple-select-modal-template.html';
                if (!vm.event.optiontemplate.options) {
                    vm.event.optiontemplate.options = [{
                        cssId: 'Q1',
                        label: ''
                    }];
                }
            } else if (templateType === 'range') {
                vm.tempalteLocation = 'app/main/common/templates/configure-linear-scale-modal-template.html';
                if (!vm.event.optiontemplate.options) {
                    vm.event.optiontemplate.options = [{
                        label: 1,
                    },
                    {
                        label: 2,
                    },
                    {
                        label: 3,
                    },
                    {
                        label: 4
                    }];
                }
            }
            console.log(vm.event);
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
            };

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
            if (!vm.event.title || !vm.event.optiontemplates[0].question || _.filter(vm.event.optiontemplates[0].options, function (item) {
                return item.label === '';
            }).length !== 0) {
                return true;
            };
        };

        /*vm.setOptions = function () {

            if (vm.event.optiontemplate.lowerRange && vm.event.optiontemplate.endRange) {
                vm.event.optiontemplate.options = [];
                for (var i = vm.event.optiontemplate.lowerRange; i <= vm.event.optiontemplate.endRange; i++) {
                    var data = {
                        label: i
                    };
                    vm.event.optiontemplate.options.push(data);
                }
            }
        }*/

    }
})();

