
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexer Game page module.
 * @module Game
 */
var Game = angular.module('indexer-game', []);

/* Cache the template file */
Game.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-game.html', require('./indexer-game.html'));
    }
]);

/**
 * Indexer game data dependencies.
 * @module Game
 * @type {service}
 */
Game.service('Indexer.Game.Data.Dependencies', [
    'Indexer.Games.Data.Dependencies', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'UsersFactory',
    function(data, teams, leagues, sports, users) {

        var Data = {

            games: data.games,
            teams: teams.load(),
            leagues: leagues.load(),
            sports: sports.load(),
            users: users.load()
        };

        return Data;
    }
]);

/**
 * Indexer game page state router.
 * @module Game
 * @type {UI-Router}
 */
Game.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexer-game', {
                url: '/game/:id',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl: 'indexer-game.html',
                        controller: 'indexer-game.Controller'
                    }
                },
                resolve: {
                    'Indexer.Game.Data': [
                        '$q', '$stateParams', 'Indexer.Game.Data.Dependencies', 'SchoolsFactory',
                        function($q, $stateParams, data, schools) {
                            return $q.all(data).then(function(data) {
                                var game = data.games.get($stateParams.id);
                                var team = data.teams.get(game.teamId);

                                if (team.schoolId) {
                                    data.school = schools.fetch(team.schoolId);
                                }

                                return $q.all(data);
                            });
                        }
                    ]
                },
                onEnter: [
                    '$state', '$stateParams', 'SessionService', 'AlertsService', 'Indexer.Game.Data',
                    function($state, $stateParams, session, alerts, data) {
                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = data.games.get(gameId);
                        var status = game.getStatus();
                        var indexable = game.isAssignedToIndexer() && game.canBeIndexed();
                        var qaAble = game.isAssignedToQa() && game.canBeQAed();

                        if (game.isAssignedToUser(userId) && (indexable || qaAble) && !game.isDeleted) {

                            alerts.add({
                                type: status.type,
                                message: status.name
                            });
                        }

                        else $state.go('401');
                    }
                ]
            });
    }
]);

/* File dependencies. */
require('./indexer-game-controller');
