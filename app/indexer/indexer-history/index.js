/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Indexer Games module.
 * @module Games
 */
var Games = angular.module('indexer-history', []);

/* Cache the template file */
Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-history.html', require('./indexer-history.html'));
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

            .state('indexer-history', {
                url: '/history',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl: 'indexer-history.html',
                        controller: 'indexer-history.Controller'
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

                    if (schoolIds.length) return schools.load(schoolIds);
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
 * Games controller.
 * @module Games
 * @name Controller
 * @type {Controller}
 */
Games.controller('indexer-history.Controller', [
    '$scope', '$state', '$interval', 'config', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'SportsFactory', 'UsersFactory', 'SessionService', 'Indexer.Games.Data', 'INDEXER_GROUPS', 'GAME_STATUSES',
    function controller($scope, $state, $interval, config, GAME_TYPES, teams, leagues, games, sports, users, session, data, INDEXER_GROUPS, GAME_STATUSES) {

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.teams = teams.getCollection();
        $scope.users = users.getCollection();
        $scope.userId = session.currentUser.id;
        $scope.footballFAQ = config.links.indexerFAQ.football.uri;
        $scope.volleyballFAQ = config.links.indexerFAQ.volleyball.uri;

        var userLocation = session.currentUser.currentRole.indexerGroupId;

        if (userLocation === INDEXER_GROUPS.US_MARKETPLACE) {
            $scope.signUpLocation = config.links.indexerSignUp.unitedStates.uri;
        } else if (userLocation === INDEXER_GROUPS.INDIA_MARKETPLACE || userLocation === INDEXER_GROUPS.INDIA_OFFICE) {
            $scope.signUpLocation = config.links.indexerSignUp.india.uri;
        } else if (userLocation === INDEXER_GROUPS.PHILIPPINES_OFFICE) {
            $scope.signUpLocation = config.links.indexerSignUp.philippines.uri;
        }

        $scope.games = games.getList({ assignedUserId: $scope.userId });

        angular.forEach($scope.games, function(game) {
            game.timeRemaining = game.assignmentTimeRemaining();
        });

        var refreshGames = function() {

            angular.forEach($scope.games, function(game) {

                if (game.timeRemaining) {

                    game.timeRemaining = moment.duration(game.timeRemaining).subtract(1, 'minute').asMilliseconds();
                }
            });
        };

        var ONE_MINUTE = 60000;

        var refreshGamesInterval = $interval(refreshGames, ONE_MINUTE);

        $scope.$on('$destroy', function() {

            $interval.cancel(refreshGamesInterval);
        });
    }
]);
