var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PositionsetsResource', [
    'config', '$resource',
    function(config, $resource) {

        var PositionsetsResource = $resource(

            config.api.uri + 'position-sets/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return PositionsetsResource;
    }
]);

