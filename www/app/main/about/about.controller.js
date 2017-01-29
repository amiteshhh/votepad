(function () {
    'use strict';
    /**
     * Module: app.about
     * Controller: AboutCtrl
     * Description: Controller to manage about
     * 
     */
    var moduleName = 'app.about';

    angular.module(moduleName)
        .controller('AboutCtrl', Ctrl);

    Ctrl.$inject = ['$injector', '$rootScope', 'APP_CONFIG'];
    function Ctrl($injector, $rootScope, APP_CONFIG) {
        var vm = this;
        var AboutSvc = $injector.get('AboutSvc');
        vm.contact = APP_CONFIG.contact;

        init();

        function init() {

            var subject = 'Issue - ' + $rootScope.appName + ' - version ' + $rootScope.appVersion;
            var body = 'Issue description provided below by ' + $rootScope.userInfo.userName + ' - ' + $rootScope.userInfo.id;
            var separator = new Array(body.length + 1).join('_');
            body += '\n' + separator + '\n\n\n\n';
            vm.email = {
                to: vm.contact.mailTo,
                subject: subject,
                body: body
            };
        }
    }
})();

