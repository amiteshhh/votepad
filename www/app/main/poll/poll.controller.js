(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.poll.PollCtrl:PollCtrl
     *
     * @description
     * PollCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.poll';

    angular.module(moduleName)
        .controller('PollCtrl', Ctrl);

    Ctrl.$inject = ['$state', '$stateParams', '$injector', '$rootScope', '$scope', '$ionicModal', '$localStorage', '$ionicLoading', '$ionicPopup', '$timeout'];
    function Ctrl($state, $stateParams, $injector, $rootScope, $scope, $ionicModal, $localStorage, $ionicLoading, $ionicPopup, $timeout) {
        var vm = this;
        var PollSvc = $injector.get('PollSvc');

        vm.event = $stateParams.eventModel;
        if(!$rootScope.userType) {
            $rootScope.userType = ($localStorage.userType === 'host' ? true : false); 
        }
        vm.liked = false;

        init();

        console.log($stateParams);


        function init() {
            console.log("inside Poll controller");
        }

        vm.showRespondedUsersList = function () {
            $rootScope.$broadcast('showUsersList', {
                userList: vm.event.eventLikedBy
            });
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }
    }
})();