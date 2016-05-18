var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FilmExchangeResource', [
    'config', '$resource',
    function(config, $resource) {
        var teamsResource = $resource(
            config.api.uri,
            {
                id: '@id'
            }, {
                getTeams: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id' + '/teams',
                    params: {start: '@start', count: '@count'},
                    isArray: true
                },
                postSuspendTeam: {
                    method: 'POST',
                    url: config.apiV2.uri + 'conference-film-exchange-suspensions'
                },
                deleteSuspendedTeam: {
                    method: 'DELETE',
                    url: config.apiV2.uri + 'conference-film-exchange-suspensions/:id',
                    isArray: true
                },
                getSuspendedTeams: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id' + '/teams',
                    params: {is_suspended: 1},
                    isArray: true
                },
                getGames: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id' + '/games',
                    params: {start: '@start', count: '@count'},
                    isArray: true
                },
                getAllConferences:{
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges',
                    isArray: true
                }
            }
        );

        return teamsResource;
    }
]);