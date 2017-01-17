(function () {
  'use strict';

  var moduleName = 'app.auth';
  var device = {"type" : "android", "udid": "123456789"}

  angular.module(moduleName)
    .service('AuthSvc', Svc);

  Svc.$inject = ['APP_CONFIG', '$http', '$q'];
  function Svc(APP_CONFIG, $http, $q) {

    return {
      registerDevice: _registerDevice,
      createUser : _createUser,
      verifyUser : _verifyUser
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
    
    function _createUser(model, id) {
        var deferred = $q.defer();
        var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/user';
        var req, method;
        method = 'POST';
        req = {
            url: url,
            method: method,
            data: {"username" : model.username, "email" : "test@gmail.com", "mobile" : model.mobileNo, "password" : model.password}
        };
        $http(req).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
    function _verifyUser(model, id) {
        var deferred = $q.defer();
        id = 1; //hardcoded for now
        var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/user/' + id;
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
  }

})();
