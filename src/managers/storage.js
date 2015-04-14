var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @name StorageManager
 * @type {service}
 */
IntelligenceWebClient.service('StorageManager', [
    '$log', '$q', 'RootStorage',
    function service($log, $q, root) {

        this.clear = function() {

            root = Object.create(null);

            function requestDatabaseDelete (resolve, reject) {

                const request = indexedDB.deleteDatabase(pkg.name);

                request.onsuccess = function databaseDeleteSuccess () {

                    resolve('Database deleted');
                };

                request.onerror = function databaseDeleteError () {

                    reject(new Error('Database could not be deleted'));
                };
            }

            return $q(requestDatabaseDelete);
        };
    }
]);
