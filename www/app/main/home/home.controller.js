(function () {
    'use strict';

    var moduleName = 'app.home';

    angular.module(moduleName)
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$ionicModal'];
    function HomeCtrl($scope, $ionicModal) {
        var vm = this;

        vm.likedBy = [{
            person: 'Pratik Anand'
        },
        {
            person: 'Saurav Sahoo'
        },
        {
            person: 'Amitesh Kumar'
        },
        {
            person: 'Haunshila Yadav'
        },
        {
            person: 'Amit Tiwary'
        },
        {
            person: 'Soham Paul'
        }];

        vm.likesModal = $ionicModal.fromTemplate(
            '<ion-modal-view>' +
            '<ion-header-bar class="bar-positive">' +
            '<button class="button button-icon icon ion-android-arrow-back" ng-click="vm.goBackToPoll()"></button>' +
            '<h1 class="title">People who liked</h1>' +
            '</ion-header-bar>' +
            '<ion-content>' +
            '<div class="list">' +
            '<div class="item" ng-repeat="item in vm.likedBy">{{item.person}}</div>' +
            '</ion-content>' +
            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            });

        vm.showLikesData = function () {
            vm.likesModal.show();
        }

        vm.goBackToPoll = function () {
            vm.likesModal.hide();
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            vm.likesModal.remove();
        });
    }
})();
