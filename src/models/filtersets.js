var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FiltersetsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'filter-sets';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        return $resource(url, paramDefaults);
    }
]);

