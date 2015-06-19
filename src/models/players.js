var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'players';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: {

                method: 'POST',
                url: config.api.uri + base
            },

            update: {

                method: 'PUT'
            },

            resendEmail: {

                method: 'POST',
                url: config.api.uri + base + '/reminder-email'
            },

            generateStats: {

                method: 'GET',
                url: url + '/analytics',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
