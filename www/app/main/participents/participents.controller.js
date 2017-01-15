(function () {
    'use strict';

    var moduleName = 'app.participents';

    angular.module(moduleName)
        .controller('ParticipentsCtrl', ParticipentsCtrl);

    ParticipentsCtrl.$inject = ['$scope', '$ionicModal'];
    function ParticipentsCtrl($scope, $ionicModal) {
        var vm = this;

        /*$ionicModal.fromTemplateUrl('chat-box-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.chatBox = modal;
        });

        vm.openChatBox = function (toChatWith) {
            vm.toChatWithPersonName = toChatWith;
            vm.chatBox.show();

        }

        vm.cancelChat = function() {
            vm.chatBox.hide();
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            vm.chatBox.remove();
        });*/
    }
})();
