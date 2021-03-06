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
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/teams',
                    params: {start: '@start', count: '@count', mascot: '@mascot', teamName: '@teamName', isSuspended: '@isSuspended'},
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
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/teams',
                    params: {isSuspended: 1},
                    isArray: true
                },
                getFilms: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/films',
                    params: {start: '@start', count: '@count', teamName: '@teamName', mascot: '@mascot', datePlayed: '@datePlayed', competitionLevel: '@competitionLevel', teamId: '@teamId'},
                    isArray: true
                },
                getAllConferences: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges',
                    params: {sportsAssociation: '@sportsAssociation', conference: '@conference', gender: '@gender', sportId: '@sportId', count: '@count'},
                    isArray: true
                },
                getCompetitionLevel:{
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/competition-levels',
                    isArray: true
                },
                shareGameWithFilmExchange: {
                    method: 'POST',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/films'
                },
                removeGameFromFilmExchange: {
                    method: 'DELETE',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/films/:idFilmExchangeFilm',
                    params: {idFilmExchangeFilm: '@idFilmExchangeFilm'}
                },
                getFilmExchangeAdmins: {
                    method: 'GET',
                    url: config.apiV2.uri + 'conference-film-exchanges/:id/administrators',
                    isArray: true
                }
            }
        );

        return teamsResource;
    }
]);
