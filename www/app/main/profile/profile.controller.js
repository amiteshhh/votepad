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

    Ctrl.$inject = ['$injector', '$rootScope'];
    function Ctrl($injector, $rootScope) {
        var vm = this;
        var ProfileSvc = $injector.get('ProfileSvc');

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
            //_sampleOperation();
        }

        function _sampleOperation() {
            ProfileSvc.sampleOperation().then(function (data) {

            }).catch(handleServiceError)
                .finally(function () {
                    //console.log('Finally hide the loader etc when error or success');
                });
        }

        function handleServiceError(err) {
            console.log('Error occurred with service', err);
            $rootScope.$broadcast('notify-service-error', err);
        }
    }
})();

