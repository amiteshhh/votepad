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
            //<a href="mailto:someone@yoursite.com?cc=someoneelse@theirsite.com, another@thatsite.com, me@mysite.com&bcc=lastperson@theirsite.com&subject=Big%20News&body=Body-goes-here">Email Us</a>
            var subject = 'Issue - ' + $rootScope.appName + ' - version ' + $rootScope.appVersion;
            var body = 'Issue description provided below by ' + $rootScope.userInfo.userName + ' - ' + $rootScope.userInfo.id ;
            var separator = new Array(body.length + 1).join( '_' );
            body += '\n' + separator + '\n\n';
            vm.mailUrl = "mailto:" + vm.contact.mailTo;
            vm.mailUrl += '?subject=' + encodeURIComponent(subject);
            vm.mailUrl += '&body=' + encodeURIComponent(body);
        }
    }
})();

