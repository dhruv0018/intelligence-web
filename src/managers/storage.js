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

            return $q(function (resolve, reject) {

                let request = indexedDB.deleteDatabase(pkg.name);

                request.onsuccess = function() {

                    resolve('Database deleted');
                };

                request.onerror = function() {

                    reject('Database could not be deleted');
                    throw new Error('Database could not be deleted');
                };
            });
        };
    }
]);
