var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'reels';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },

            query: {
                method: 'GET',
                isArray: true,
                params: {
                    isDeleted: false
                }
            },
            batchUpdate: {
                method: 'POST',
                url: config.api.uri + base + '/batch',
                isArray: true
            },
            removeTelestration: {
                method: 'DELETE',
                url: config.api.uri + base + '/:id/telestrations/delete',
                params: {time: '@time', playId: '@playId'}
            },
        };

        return $resource(url, paramDefaults, actions);
    }
]);
