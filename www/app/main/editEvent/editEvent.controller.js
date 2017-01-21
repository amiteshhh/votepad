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

    Ctrl.$inject = ['$state', '$stateParams', '$injector', '$rootScope', '$localStorage', '$timeout'];
    function Ctrl($state, $stateParams, $injector, $rootScope, $localStorage, $timeout) {
        var vm = this;
        var EditEventSvc = $injector.get('EditEventSvc');

        console.log($stateParams);
        var templateType = $stateParams.templateType;
        if (!$localStorage.eventData) {
            $localStorage.eventData = [];
        }

        init();

        function init() {
            if (templateType === 'text') {
                vm.tempalteLocation = '/app/main/common/templates/configure-text-modal-template.html'
            }
        }

        //--------------------------------- TEXT -----------------------------------

        vm.textQuesArray = [{
            id: 'Q1',
            textQuestion: ''
        }
        ];

        vm.addQueToTextQuesArray = function () {
            var textQuesArrayLength = vm.textQuesArray.length + 1;
            var tempTextQuest = {
                id: 'Q' + textQuesArrayLength,
                textQuestion: ''
            }

            vm.textQuesArray.push(tempTextQuest);
            $timeout(function () {
                document.querySelector('#' + tempTextQuest.id).select();
            }, 50, false);

        };

        vm.deleteQueFromTextQuesArray = function (item) {
            vm.textQuesArray.splice(vm.textQuesArray.indexOf(item), 1);
            console.log(vm.textQuesArray);

        };

        vm.validateLaunchPoll = function () {
            if (!vm.textEventName || _.filter(vm.textQuesArray, function (item) {
                return item.textQuestion === '';
            }).length !== 0) {
                return true;
            };

        };

        vm.textEventConfigured = function () {
            eventConfigured(1, 'Textual', vm.textEventName, vm.textEventDescp);
            vm.textEventName = '';
            vm.textEventDescp = '';
            vm.textQuesArray = [{
                id: 'Q1',
                textQuestion: ''
            }
            ];
            //TODO ----------- Toast message goes here
            console.log($localStorage.eventData);
        };
        // -------------------------------------------------------------------

        function eventConfigured(eventTyp, eventTypeDet, eventNam, eventDesc) {
            var eventData = {
                eventType: eventTyp,
                eventTypeDetail: eventTypeDet,
                eventName: eventNam,
                eventDescp: eventDesc,
                eventQues: vm.textQuesArray
            };
            $localStorage.eventData.push(eventData);
        }


    }
})();

