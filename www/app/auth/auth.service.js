(function () {
  'use strict';

  var moduleName = 'app.auth';

  angular.module(moduleName)
    .service('AuthSvc', Svc);

  Svc.$inject = ['APP_CONFIG', '$http', '$q'];
  function Svc(APP_CONFIG, $http, $q) {

    return {
      registerDevice: _registerDevice
    };

    function _registerDevice() {

      if (typeof device === 'undefined' || !device) {
        return;
      }
      var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + "/register/registerDevice";
      var data = {
        "deviceId": device.uuid
      };
      var req = {
        url: url,
        method: 'POST',
        data: data
      };

      $http(req).then(function (response) {
      }, function (err) {
        console.log('Error response from service to register device: ', err);
      });

    }
  }

})();
