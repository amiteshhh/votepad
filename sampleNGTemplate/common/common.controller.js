(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.common.CommonCtrl:CommonCtrl
     *
     * @description
     * CommonCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.common';

    angular.module(moduleName)
        .controller('CommonCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope'];
    function Ctrl($injector, $rootScope) {
        var vm = this;
        var CommonSvc = $injector.get('CommonSvc');

        init();

        /**
         * @ngdoc function  
         * @name app.common.CommonCtrl#init
         *
         * @description
         * I am method of CommonCtrl.
         * @methodOf app.common.CommonCtrl:CommonCtrl
         */
        function init() {
            //_sampleOperation();
        }

        function _sampleOperation() {
            CommonSvc.sampleOperation().then(function (data) {

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

