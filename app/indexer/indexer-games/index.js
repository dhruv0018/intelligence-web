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
    '$q', 'SessionService', 'UsersFactory', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory',
    function($q, session, users, games, teams, leagues, sports) {

        var currentUser = session.currentUser;

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            teams: teams.load(),
            users: users.load(),
            games: games.load({
                assignedUserId: currentUser.id
            })
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
    '$scope', '$state', 'config', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'UsersFactory', 'SessionService', 'Indexer.Games.Data', 'INDEXER_GROUPS', 'GAME_STATUSES',
    function controller($scope, $state, config, GAME_TYPES, teams, leagues, games, users, session, data, INDEXER_GROUPS, GAME_STATUSES) {

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.sports = data.sports.getCollection();
        $scope.leagues = data.leagues.getCollection();
        $scope.teams = data.teams.getCollection();
        $scope.users = data.users.getCollection();

        $scope.userId = session.currentUser.id;

        var userLocation = session.currentUser.currentRole.indexerGroupId;

        if (userLocation === INDEXER_GROUPS.US_MARKETPLACE) {
            $scope.signUpLocation = config.links.indexerSignUp.unitedStates.uri;
        } else if (userLocation === INDEXER_GROUPS.INDIA_MARKETPLACE || $scope.userLocation === INDEXER_GROUPS.INDIA_OFFICE) {
            $scope.signUpLocation = config.links.indexerSignUp.india.uri;
        } else if (userLocation === INDEXER_GROUPS.PHILIPPINES_OFFICE) {
            $scope.signUpLocation = config.links.indexerSignUp.philippines.uri;
        }

        $scope.games = data.games.getList().filter(function(game) {

            return game.isAssignedToUser(session.currentUser.id);
        });
    }
]);
