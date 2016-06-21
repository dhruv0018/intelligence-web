var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('GamesResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'games';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id',
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

            getFormationReport: {method: 'GET', url: config.api.uri + base + '/:id/formation-report'},

            generateDownAndDistanceReport: {
                method: 'POST',
                url: config.api.uri + base + '/:id/dnd-report'
            },

            generateStats: {
                method: 'GET',
                url: url + '/stats',
                isArray: true
            },

            copy: {
                method: 'POST',
                url: config.api.uri + base + '/actions/copy',
            },

            getQueueDashboardCounts: {

                method: 'GET',
                url: config.api.uri + base + '/queued-games-count'
            },

            retrieveArenaEvents: {
                method: 'GET',
                isArray: true,
                url: config.api.uri + base + '/:id/arena-events'
            },

            getFilmExchanges: {
                method: 'GET',
                url: config.apiV2.uri + base + '/:id/film-exchanges',
                isArray: true
            },

            copyFromFilmExchange: {
                method: 'POST',
                url: config.apiV2.uri + base + '/:id/copy-to-team/:teamId',
                params: {sportsAssociation: '@sportsAssociation', conference: '@conference', gender: '@gender', sportId: '@sportId'}
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
