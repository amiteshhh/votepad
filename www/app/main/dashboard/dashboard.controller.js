(function () {
    'use strict';

    var moduleName = 'app.dashboard';

    angular.module(moduleName)
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$ionicModal'];
    function DashboardCtrl($scope, $ionicModal) {
        var vm = this;
        
    }
})();
