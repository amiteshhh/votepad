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
        var EventSvc = $injector.get('EventSvc');

        vm.event = $stateParams.eventModel;
        vm.userType = $stateParams.userType;
        vm.liked = false;

        init();

        console.log($stateParams);


        function init() {
            console.log("inside Poll controller");
            vm.liked = hasEventUserRef(vm.event, 'eventLikedBy', $rootScope.userInfo.id);
            //_findeOne(vm.event.id);
        }

        function _findeOne(id) {
            EventSvc.findOne(id).then(function (data) {
                vm.event = data;
                console.log(data);
            }, handleServiceError);
        }

        function hasEventUserRef(event, fk, fkId) {
            return _.some(event[fk], function (likedBy) {
                return likedBy.id === fkId;
            });
        }

        vm.showRespondedUsersList = function () {
            $rootScope.$broadcast('showUsersList', {
                userList: vm.event.eventLikedBy
            });
        };

        vm.toggleLikeEvent = function () {
            vm.liked = !vm.liked;
            EventSvc.pushEventUserRef(vm.event.id, 'eventLikedBy', $rootScope.userInfo.id, vm.liked).then(function (data) {
                console.log(data);

            }, handleServiceError);
        };

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }
    }
})();