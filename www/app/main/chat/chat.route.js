(function () {
    'use strict';

    var moduleName = 'app.chat';

    angular.module(moduleName).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('app.chat', {
            url: '/chat',
            views: {
                'menuContent': {
                    templateUrl: 'app/main/chat/chat.html',
                    controller: 'ChatController as vm'
                }
            }
        });
    }


})();