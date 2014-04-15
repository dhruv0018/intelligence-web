

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
                    'Coach.FilmHome.Data': ['$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', function ($q, session, teams, games, players) {
                        var data = {
                            teamId : session.currentUser.currentRole.teamId,
                            games: [],
                            team : {}
                        };

                        data.games = games.getList({teamId: data.teamId});
                        data.team = teams.get(data.teamId);

//                        return $q.all({
//                            games: data.games.$promise,
//                            team: data.team.$promise
//                        });

//                        return data.games.$promise;
                        return data;
                        //return $q.all(data);
                        //return data;

                    }]
                }
            });
    }
]);

/* File dependencies */
require('./controller');
