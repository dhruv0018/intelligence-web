
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
    'SessionService', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'UsersFactory', 'GamesFactory', 'SchoolsFactory',
    function(session, teams, leagues, sports, users, games, schools) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),

            get users() {

                var userId = session.currentUser.id;

                return users.load({ relatedUserId: userId });
            },

            get teams() {

                var userId = session.currentUser.id;

                return teams.load({ relatedUserId: userId });
            },

            get schools() {

                return this.teams.then(function(teams) {

                    var schoolIds = teams

                    .filter(function(team) {

                        return team.schoolId;
                    })

                    .map(function(team) {

                        return team.schoolId;
                    });

                    return schools.load(schoolIds);
                });
            },

            get games() {

                var userId = session.currentUser.id;

                return games.load({ assignedUserId: userId });
            }
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
                        '$q', 'Indexer.Game.Data.Dependencies',
                        function($q, data) {

                            return $q.all(data);
                        }
                    ]
                },
                onEnter: [
                    '$state', '$stateParams', 'SessionService', 'AlertsService', 'Indexer.Game.Data', 'GamesFactory',
                    function($state, $stateParams, session, alerts, data, games) {
                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = games.get(gameId);
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
