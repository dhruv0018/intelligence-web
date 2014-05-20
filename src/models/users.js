var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('UsersResource', [
    'config', '$resource',
    function(config, $resource) {

        var UsersResource = $resource(

            config.api.uri + 'users/:id',

            {
                id: '@id'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return UsersResource;
    }
]);

