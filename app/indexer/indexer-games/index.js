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
    '$scope', '$state', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'UsersFactory', 'SessionService', 'Indexer.Games.Data', 'GAME_STATUSES',
    function controller($scope, $state, GAME_TYPES, teams, leagues, games, users, session, data, GAME_STATUSES) {

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.sports = data.sports.getCollection();
        $scope.leagues = data.leagues.getCollection();
        $scope.teams = data.teams.getCollection();
        $scope.users = data.users.getCollection();

        $scope.userId = session.currentUser.id;

        var role = session.currentUser.currentRole;
        console.log(role);
        $scope.userLocation = role.indexerGroupId;
        console.log($scope.userLocation);

        if ($scope.userLocation === 1) {
            $scope.signUpLocation = 'https://docs.google.com/a/krossover.com/spreadsheet/viewform?formkey=dFFlTUxoZk1SdEFHZmxBVkVCTkhpV3c6MQ#gid=0';
        } else if ($scope.userLocation === 2 || $scope.userLocation === 3) {
            $scope.signUpLocation = 'https://docs.google.com/a/krossover.com/forms/d/11sO_s9rf9a1gZvtQ5spykOzLfzRC6pFop99z4KBZ8pg/viewform';
        } else if ($scope.userLocation === 4) {
            $scope.userLocation = 'https://docs.google.com/a/krossover.com/spreadsheet/viewform?formkey=dEN0MXFObTNDSXN3b013SHF3cFdpOEE6MA#gid=0';
        }

        $scope.games = data.games.getList().filter(function(game) {

            return game.isAssignedToUser(session.currentUser.id);
        });
    }
]);
