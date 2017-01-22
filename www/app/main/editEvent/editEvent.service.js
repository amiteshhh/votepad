(function () {
    'use strict';

    /**
     * @ngdoc service  
     * @name app.editEvent.EditEventSvc
     *
     * @description
     * Service to manage `app.editEvent` module
     *
     * @requires $http
     * @requires $q
     * @requires APP_CONFIG
     */

    var moduleName = 'app.editEvent';

    angular.module(moduleName)
        .service('EditEventSvc', Svc);
    /* Tweak the dependency like APP_CONFIG as per your requirement */
    Svc.$inject = ['$http', '$q', 'APP_CONFIG'];
    function Svc($http, $q, APP_CONFIG) {

        return {
            //sampleOperation: _sampleOperation,
            createOrUpdate: _createOrUpdate,
            destroy: _destroy

        };

        function _createOrUpdate(templateType, model) {
            var deferred = $q.defer();
            //var pathTo;

            /*switch (templateType) {
                case 'text': {
                    pathTo = '/event';
                    break;
                }
                case 'yesNo':
                case 'singleSelect':
                case 'multiSelect': 
                case 'range': {
                    pathTo = '/optiontemplate';
                    break;
                }
            };*/

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
    }
})();
