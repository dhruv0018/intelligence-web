

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome', [
    'ui.router',
    'ui.bootstrap',
    'coach-info',
    'roster',
    'film',
    'no-results'
]);

/* Cache the template files */
FilmHome.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/film-home/template.html', require('./template.html'));
    }
]);

/**
 * FilmHome page data service.
 * @module FilmHome
 * @type {service}
 */
FilmHome.service('Coach.FilmHome.Data', [
    '$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory',
    function($q, session, teams, games, players) {
        var promises = {};
        var deferred = $q.defer();
        var promisedGames = $q.defer();
        var promisedTeam = $q.defer();
        var promisedTeams = $q.defer();
        var promisedRoster = $q.defer();

        //TODO get real teamroster id
        var data = {
            teamId : session.currentUser.currentRole.teamId,
            games: promisedGames,
            team : promisedTeam,
            rosterId: '25'
        };

        games.getList({teamId: data.teamId}, function(gamesList) {
            promisedGames.resolve(gamesList);
        });

        teams.getList({}, function(teams) {
            promisedTeams.resolve(teams);
            promisedTeam.resolve(teams[data.teamId]);
        }, function() {
            console.log('failure to get the teams');
        }, true);


        players.getList({
            roster: data.rosterId
        }, function (players) {
            promisedRoster.resolve(players);
        });

        promises = {
            games: promisedGames.promise,
            coachTeam: promisedTeam.promise,
            teams: promisedTeams.promise,
            roster: promisedRoster.promise,
            rosterId: $q.when({id: data.rosterId})
        };

        return $q.all(promises);
    }
]);

/**
 * FilmHome page state router.
 * @module FilmHome
 * @type {UI-Router}
 */
FilmHome.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('Coach.FilmHome', {
                url: '/film-home',
                views: {
                    'main@root': {
                        templateUrl: 'coach/film-home/template.html',
                        controller: 'Coach.FilmHome.controller'
                    }
                }
            });
    }
]);

/* File dependencies */
require('./controller');
