var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SportsResource', [
    'config', '$resource',
    function(config, $resource) {

        var SportsResource = $resource(

            config.api.uri + 'sports/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SportsResource;
    }
]);

