(function () {
    'use strict';

    var moduleName = 'app.createEvent';

    angular.module(moduleName)
        .controller('CreateEventCtrl', CreateEventCtrl);

    CreateEventCtrl.$inject = ['$state'];
    function CreateEventCtrl($state) {
        var vm = this;
    }
})();
