

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
    'film'
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

        var Data = {

            init: function() {

                var promises = [];
                var deferred = $q.defer();
                var promisedGames = $q.defer();
                var promisedTeam = $q.defer();

                var data = {
                    teamId : session.currentUser.currentRole.teamId,
                    games: promisedGames,
                    team : promisedTeam
                };

                games.getList({teamId: data.teamId}, function(gamesList) {

                    console.dir(gamesList);
                    promisedGames.resolve(gamesList);
                });

                teams.get(data.teamId, function(team) {

                    console.dir(team);
                    promisedTeam.resolve(team);
                });

                promises.push(promisedGames.promise);
                promises.push(promisedTeam.promise);

                $q.all(promises).then(function() {

                    console.log('resolve');
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
        };

        return Data;
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
                },
                resolve: {
                    Data: [
                        'Coach.FilmHome.Data',
                        function(data) {

                            return data.init();
                        }
                    ]
                }
            });
    }
]);

/* File dependencies */
require('./controller');
