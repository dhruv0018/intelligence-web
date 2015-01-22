var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @name StorageManager
 * @type {service}
 */
IntelligenceWebClient.service('StorageManager', [
    '$q', 'RootStorage',
    function service($q, root) {

        this.clear = function() {

            root = Object.create(null);

            var deferred = $q.defer();

            var request = indexedDB.deleteDatabase(pkg.name);

            request.onsuccess = function() {

                console.log('Database deleted');

                deferred.resolve();

                window.location.reload();
            };

            request.onerror = function() {

                console.log('Database could not be deleted');

                deferred.reject(new Error('Database could not be deleted'));
            };

            return deferred.promise;
        };
    }
]);

