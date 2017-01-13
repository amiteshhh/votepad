(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .service('EventSvc', Svc);

    Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc($http, $q, APP_CONFIG) {

        return {
            createOrUpdate: _createOrUpdate,
            destroy: _destroy,
            find: _find
        };

        function _createOrUpdate(model, id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event';
            var req, method;
            if (id) {
                url += '/' + id;
                method = 'PUT';
            } else {
                method = 'POST';
            }
            req = {
                url: url,
                method: method,
                data: model
            };
            $http(req).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _destroy(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/' + id;
            $http.delete(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _find() {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/find';
            $http.get(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
})();
