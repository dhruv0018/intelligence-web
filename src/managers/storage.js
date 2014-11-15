var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @name StorageManager
 * @type {service}
 */
IntelligenceWebClient.service('StorageManager', [
    'RootStorage',
    function service(root) {

        this.clear = function() {

            root = Object.create(null);
        };
    }
]);

