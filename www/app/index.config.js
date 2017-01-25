(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName)
        .config(config);

    config.$inject = ['$provide', '$ionicConfigProvider'];
    function config($provide, $ionicConfigProvider) {
        $ionicConfigProvider.scrolling.jsScrolling(false);// i.e overflow-scroll="true" --ionic scroll really laggy in redmi
        $provide.decorator('$exceptionHandler', function ($delegate) {

            return function (exception, cause) {
                $delegate(exception, cause);
                /*var toast = new iqwerty.toast.Toast();
                toast.setText('Exception: ' + exception.message)
                    .setDuration(3000)
                    .stylize({
                        background: 'red',
                        color: 'white',
                        'box-shadow': '0 0 50px rgba(0, 0, 0, .7)'
                    })
                    .show();*/
                iqwerty.toast.Toast('Exception: ' + exception.message);
            };
        });
    }

})();