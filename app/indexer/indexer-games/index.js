/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Indexer Games module.
 * @module Games
 */
var Games = angular.module('indexer-games', []);

/* Cache the template file */
Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-games.html', require('./indexer-games.html'));
    }
]);

/**
 * Games page state router.
 * @module Games
 * @type {UI-Router}
 */
Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexer-games', {
                url: '/games',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl: 'indexer-games.html',
                        controller: 'indexer-games.Controller'
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'Indexer.Games.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

/**
 * Games service
 * @module Games
 * @name Service
 * @type {Service}
 */
Games.service('Indexer.Games.Data.Dependencies', [
    '$q', 'SessionService', 'UsersFactory', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'SchoolsFactory',
    function($q, session, users, games, teams, leagues, sports, schools) {

        const userId = session.currentUser.id;

        let Data = {

            sports: sports.load(),
            leagues: leagues.load(),

            get users() {

                return users.load({ relatedUserId: userId });
            },

            get teams() {

                return teams.load({ relatedUserId: userId });
            },

            get schools() {

                return this.teams.then(function(teams) {

                    let schoolIds = teams

                    .filter(function(team) {

                        return team.schoolId;
                    })

                    .map(function(team) {

                        return team.schoolId;
                    });

                    if (schoolIds.length) return schools.load(schoolIds);
                });
            },

            get games() {

                return games.load({ assignedUserId: userId });
            }
        };

        return Data;
    }
]);



/**
 * Games controller.
 * @module Games
 * @name Controller
 * @type {Controller}
 */
Games.controller('indexer-games.Controller', [
    '$scope', '$state', '$interval', 'config', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'SportsFactory', 'UsersFactory', 'SessionService', 'Indexer.Games.Data', 'INDEXER_GROUPS', 'GAME_STATUSES',
    function controller($scope, $state, $interval, config, GAME_TYPES, teams, leagues, games, sports, users, session, data, INDEXER_GROUPS, GAME_STATUSES) {

        const ONE_MINUTE = 60000;
        const userLocation = session.currentUser.currentRole.indexerGroupId;

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.teams = teams.getCollection();
        $scope.users = users.getCollection();
        $scope.userId = session.currentUser.id;
        $scope.footballFAQ = config.links.indexerFAQ.football.uri;
        $scope.volleyballFAQ = config.links.indexerFAQ.volleyball.uri;

        switch (userLocation) {
            case INDEXER_GROUPS.US_MARKETPLACE:
                $scope.signUpLocation = config.links.indexerSignUp.unitedStates.uri;
                break;
            case INDEXER_GROUPS.INDIA_MARKETPLACE:
            case INDEXER_GROUPS.INDIA_OFFICE:
                $scope.signUpLocation = config.links.indexerSignUp.india.uri;
                break;
            case INDEXER_GROUPS.PHILIPPINES_OFFICE:
                $scope.signUpLocation = config.links.indexerSignUp.philippines.uri;
                break;
        }

        $scope.games = games.getList({ assignedUserId: $scope.userId });

        angular.forEach($scope.games, function(game) {
            game.timeRemaining = game.assignmentTimeRemaining();
        });

        let refreshGames = function() {

            angular.forEach($scope.games, function(game) {

                if (game.timeRemaining) {

                    game.timeRemaining = moment.duration(game.timeRemaining).subtract(1, 'minute').asMilliseconds();
                }
            });
        };

        let refreshGamesInterval = $interval(refreshGames, ONE_MINUTE);

        $scope.$on('$destroy', function() {

            $interval.cancel(refreshGamesInterval);
        });
    }
]);

//TODO find out why games are coming down for indexers if they are not assigned to them or their assignment has finished
Games.filter('assignedGames',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return game.indexerAssignments.some(function(assignment) {
                        return !assignment.timeFinished && assignment.userId === session.currentUser.id;
                    });
                });
            };
        }
    ]);
