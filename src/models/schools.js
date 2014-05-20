var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('SchoolsResource', [
    'config', '$resource',
    function(config, $resource) {

        var SchoolsResource = $resource(

            config.api.uri + 'schools/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SchoolsResource;
    }
]);

