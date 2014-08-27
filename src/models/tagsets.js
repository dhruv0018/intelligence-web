var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsResource', [
    'config', '$resource',
    function(config, $resource) {

        var TagsetsResource = $resource(

            config.api.uri + 'tag-sets/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return TagsetsResource;
    }
]);

