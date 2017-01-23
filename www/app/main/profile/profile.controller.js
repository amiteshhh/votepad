(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.profile.ProfileCtrl:ProfileCtrl
     *
     * @description
     * ProfileCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.profile';

    angular.module(moduleName)
        .controller('ProfileCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope', '$localStorage'];
    function Ctrl($injector, $rootScope, $localStorage) {
        var vm = this;
        var ProfileSvc = $injector.get('ProfileSvc');
        if(!$rootScope.userInfo) {
            $rootScope.userInfo = $localStorage.userInfo;
        }
        

        console.log(vm.userInfo);
        console.log($localStorage.userInfo);

        init();

        /**
         * @ngdoc function  
         * @name app.profile.ProfileCtrl#init
         *
         * @description
         * I am method of ProfileCtrl.
         * @methodOf app.profile.ProfileCtrl:ProfileCtrl
         */
        function init() {
            //vm.userInfo = $localStorage.userInfo;
        }

        
    }
})();

