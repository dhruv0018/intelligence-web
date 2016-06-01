var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'teams';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },
            getOpponentTeam:{
                method: 'GET',
                url: config.apiV2.uri + base,
                params: {conferenceTeamId: '@conferenceTeamId', opponentTeamName: '@opponentTeamName'},
                isArray: true
            },
            getFilmExchanges: {
                method: 'GET',
                url: config.apiV2.uri + base + '/:id' + '/film-exchanges',
                isArray: true
            },
            getRemainingBreakdowns: {
                method: 'GET',
                url: url + '/remainingBreakdowns'
            },
            generateStats: {
                method: 'GET',
                url: url + '/analytics',
                isArray: true
            },
            getAvailableConferences:{
                method: 'GET',
                url: config.apiV2.uri  + 'conference-sports',
                params: {teamId: '@id'},
                isArray: true
            },
            getConferences:{
                method: 'GET',
                url: config.apiV2.uri + base + '/:id' + '/conference-memberships',
                isArray: true
            },
            createConference:{
                method: 'POST',
                url: config.apiV2.uri + base + '/:id' + '/conference-memberships'
            },
            deleteConference: {
                method: 'DELETE',
                url: config.apiV2.uri + base + '/:id' + '/conference-memberships/:conferenceId',
                params: {id: '@id', conferenceId: '@conferenceId'}
            },
            updateConference: {
                method: 'PUT',
                url: config.apiV2.uri + base + '/:id' + '/conference-memberships/:conferenceId',
                params: {id: '@id', conferenceId: '@conferenceId'}
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
