(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$ionicModal', '$localStorage', '$state'];
    function DashboardCtrl($scope, $ionicModal, $localStorage, $state) {
        var vm = this;
        vm.userName = $localStorage.signInInfo.username;
        vm.compName = "Cognizant";
        vm.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        vm.data = [300, 500, 100];
        
        vm.pollData = [
            {
                id: 1,
                name: "Cordova",
                created: "25/12/16",
                updated: "25/12/16",
                status: "Closed"
            },
            {
                id: 2,
                name: "Angular",
                created: "22/12/16",
                updated: "23/12/16",
                status: "Not Started"
            },
            {
                id: 3,
                name: "Ionic",
                created: "11/01/17",
                updated: "15/01/17",
                status: "Closed"
            }
        ]

        vm.createEvent = function() {
            $state.go('app.createEvent');
        }
        
    }
})();
