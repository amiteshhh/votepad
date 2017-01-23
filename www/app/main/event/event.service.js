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
            findOneDeep: _findOneDeep,
            saveTextTemplate: _saveTextTemplate,
            pushOptionRespondedBy: _pushOptionRespondedBy,
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

        function _findOneDeep(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/event/' + id;
            $http.get(url).then(function (response) {
                var data = response.data;
                if (data.templateType === 'text' || (!data.optionTemplate || !data.optionTemplate.id)) {
                    deferred.resolve(data);
                    return;
                }
                url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/optionTemplate/' + data.optionTemplate.id;
                $http.get(url).then(function (response) {
                    data.optionTemplate = response.data;
                    _fetchOptions(data.optionTemplate).then(function (options) {
                        data.optionTemplate.options = options;
                        deferred.resolve(data);
                    }, function (err) {
                        deferred.reject(err);
                    });

                }, function (err) {
                    deferred.reject(err);
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _fetchOptions_bak(optionTemplate) {
            var ids = _.pluck(optionTemplate.options, 'id');
            var deferred = $q.defer();
            if (!ids.length) {
                return deferred.resolve({ data: [] });
            }
            var queryClause = 'where={id:[' + ids.toString() + ']}';//not working
            //http://localhost:1337/event?where={%22id%22:[1,%202]}

            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/options?' + queryClause;
            $http.get(url).then(function (response) {
                //optionTemplate.options = response.data;
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _fetchOptions(optionTemplate) {
            var deferred = $q.defer();
            var promises = [];
            _.each(optionTemplate.options, function (option) {
                promises.push(_findOneOption(option.id));
            });
            $q.all(promises).then(function (response) {
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function _findOneOption(id) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/options/' + id;
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

        function _pushOptionRespondedBy(id, fkId, toDelete) {
            var deferred = $q.defer();
            var url = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT + '/options/' + id + '/optionRespondedBy/' + fkId;
            var req, method;
            method = toDelete ? 'DELETE' : 'POST';
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
