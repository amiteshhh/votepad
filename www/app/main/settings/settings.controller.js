(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name app.settings.SettingsCtrl:SettingsCtrl
     *
     * @description
     * SettingsCtrl controller.
     *
     * @requires $injector
     * @requires $rootScope
     */
    var moduleName = 'app.settings';

    angular.module(moduleName)
        .controller('SettingsCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope'];
    function Ctrl($injector, $rootScope) {
        var vm = this;
        var SettingsSvc = $injector.get('SettingsSvc');

        init();

        /**
         * @ngdoc function  
         * @name app.settings.SettingsCtrl#init
         *
         * @description
         * I am method of SettingsCtrl.
         * @methodOf app.settings.SettingsCtrl:SettingsCtrl
         */
        function init() {
            //_sampleOperation();
        }

        function _sampleOperation() {
            SettingsSvc.sampleOperation().then(function (data) {

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

