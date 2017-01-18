(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$scope', '$ionicModal', '$ionicPopup', '$timeout'];
    function CreateEventCtrl($scope, $ionicModal, $ionicPopup, $timeout) {
        var vm = this;

        vm.singleSelectOptions = [];
        vm.showSingleSelectOptionDelete = false;
        
        vm.showInbuiltQues = true;
        vm.showCustomQues = true;

        
        vm.createOption = [];
        var question;

        //FINALIZED CODE FOR SINGLE SELECT -----------------------------------

        vm.configureSingleSelect = function () {            
            
            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-single-select-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configSingleSelect = modal;
                modal.show();
            });
        };

        vm.addSingleSelectOption = function () {
            
            vm.optionItem = {
                index: vm.singleSelectOptions.length + 1,
                value: vm.option
            };
            vm.singleSelectOptions.push(vm.optionItem);
            vm.optionItem = {};
            vm.option = '';
            console.log(vm.singleSelectOptions);
        };

        vm.deleteSingleSelectOption = function(item) {

            console.log(vm.singleSelectOptions);
            /*var startDecrimentingArrayIndexFrom = vm.singleSelectOptions.indexOf(item) + 1;
            for(var i = startDecrimentingArrayIndexFrom; i < vm.singleSelectOptions.length; i++ ) {
                i = i - 1;
            };*/



            //vm.singleSelectOptions.splice(item, 1);
            //console.log(vm.singleSelectOptions); 
        } 
        // -------------------------------------------------------------------






        vm.openResponseFormat = function () {
            $ionicModal.fromTemplateUrl('app/main/common/templates/configure-question-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.configQues = modal;
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

        vm.itemIndex = function (item) {
            return vm.createOption.indexOf(item);
        }

        

        vm.backFromSingleSelect = function () {
            vm.configSingleSelect.hide();
        };

        vm.backFromConfigQues = function () {
            vm.configQues.hide();
        };

    }
})();
