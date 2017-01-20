(function () {
    'use strict';

    var moduleName = 'app.participents';

    angular.module(moduleName)
        .service('ParticipentsSvc', ParticipentsSvc);

    ParticipentsSvc.$inject = [];
    function ParticipentsSvc() {
    }
})();
