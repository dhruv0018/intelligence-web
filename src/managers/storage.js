var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @name StorageManager
 * @type {service}
 */
IntelligenceWebClient.service('StorageManager', [
    '$log', 'RootStorage',
    function service($log, root) {

        this.clear = function() {

            root = Object.create(null);

            var request = indexedDB.deleteDatabase(pkg.name);

            request.onsuccess = function() {

                $log.info('Database deleted');

                window.location.reload();
            };

            request.onerror = function() {

                $log.error('Database could not be deleted');

                throw new Error('Database could not be deleted');
            };
        };
    }
]);

