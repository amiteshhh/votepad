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

    Ctrl.$inject = ['$scope', '$state', '$stateParams', '$injector', '$rootScope', '$localStorage', '$timeout', '$ionicLoading', '$ionicHistory'];
    function Ctrl($scope, $state, $stateParams, $injector, $rootScope, $localStorage, $timeout, $ionicLoading, $ionicHistory) {
        var vm = this;
        var EditEventSvc = $injector.get('EditEventSvc');
        var EventSvc = $injector.get('EventSvc');

        var templateType = $stateParams.templateType;
        var id = $stateParams.id;

        vm.createOptionsForLinearRange = createOptionsForLinearRange;

        init();

        function init() {
            if (id) {
                _findOneDeep(id);
                return;
            }
            vm.event = {};
            vm.event.templateType = templateType;
            vm.event.eventHostedBy = $rootScope.userInfo.id;
            setModalTemplate();
            initTemplate();
            console.log(vm.event);
        }

        function _findOneDeep(id) {
            EventSvc.findOneDeep(id).then(function (data) {
                vm.event = data;
                templateType = vm.event.templateType;
                setModalTemplate();
                initTemplate();
            }, handleServiceError);
        }

        function initTemplate() {
            if (templateType === 'text') {
                if (!vm.event.textTemplates || !vm.event.textTemplates.length) {
                    initTextTemplate();
                }
            } else {
                if (!vm.event.optionTemplate) {
                    initOptionTemplate();
                }

                if (templateType === 'range') {
                    vm.createOptionsForLinearRange();
                }
            }
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
            vm.event.optionTemplate = optionTemplate;
        }
        function setModalTemplate() {
            if (templateType === 'text') {
                vm.tempalteLocation = 'app/main/common/templates/configure-text-modal-template.html';
            }
            else if (templateType === 'yesNo') {
                vm.tempalteLocation = 'app/main/common/templates/configure-single-select-modal-template.html';
            }
            else if (templateType === 'singleSelect') {
                vm.tempalteLocation = 'app/main/common/templates/configure-single-select-modal-template.html';
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
                document.querySelector('#' + tempTextQuest.cssId).focus();
            }, 200, false);
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
        vm.createOrUpdateEvent = function (launchPoll) {
            $ionicLoading.show();
            EditEventSvc.createOrUpdate(templateType, vm.event).then(function (data) {
                if (launchPoll) {
                    var routeData = {
                        eventModel: data,
                        id: data.id,
                        userType: $localStorage.userType
                    };
                    //iqwerty.toast.Toast('Successfully Registered !');
                    $state.go('app.poll', routeData);
                } else {
                    iqwerty.toast.Toast('Event Created Successfully !');
                    $state.go('app.event');
                }

                $ionicHistory.nextViewOptions({
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
                document.querySelector('#' + option.cssId).focus();
            }, 200, false);
            console.log(vm.event);
        };

        //Same for Yes/No, singleSelect, multiSelect, linearRange
        vm.defaultValidateLaunchPoll = function () {

            if (templateType === 'range') {
                if (!vm.event.title || !vm.event.optionTemplate.question || !vm.event.optionTemplate.lowerRange || !vm.event.optionTemplate.upperRange) {
                    return true;
                }
            }

            if (!vm.event.title || !vm.event.optionTemplate.question || _.filter(vm.event.optionTemplate.options, function (item) {
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

