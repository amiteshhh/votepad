(function () {
    'use strict';

    var moduleName = 'app.event';

    angular.module(moduleName)
        .service('EventSvc', Svc);

    Svc.$inject = ['$http', '$q', 'APP_CONFIG', '$rootScope'];
    function Svc($http, $q, APP_CONFIG, $rootScope) {

        return {
            createOrUpdate: _createOrUpdate,
            destroy: _destroy,
            find: _find,
            findOne: _findOne,
            saveTextTemplate: _saveTextTemplate,
            pushEventUserRef: _pushEventUserRef
        };

        function _createOrUpdate(model) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event';
            var req, method;
            if (model.id) {
                url += '/' + model.id;
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

        function _findOne(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/' + id;
            $http.get(url).then(function (response) {
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
                $rootScope.events = response.data;
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _pushEventUserRef(id, fk, fkId, like) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/' + id + '/' + fk + '/' + fkId;
            var req, method;
            method = like ? 'POST' : 'DELETE';
            req = {
                url: url,
                method: method
            };
            $http(req).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
        function _saveTextTemplate(model) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/texttemplate';
            var req;
            req = {
                url: url,
                method: 'POST',
                data: model
            };
            $http(req).then(function (response) {
                deferred.resolve(response.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
})();
