var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('LeaguesResource', [
    'config', '$resource',
    function(config, $resource) {

        var LeaguesResource = $resource(

            config.api.uri + 'leagues/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return LeaguesResource;
    }
]);

