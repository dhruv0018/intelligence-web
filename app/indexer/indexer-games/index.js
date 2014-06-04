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
                        '$q', 'Indexer.Games.Data',
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
Games.service('Indexer.Games.Data', [
    '$q', 'UsersFactory', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory','SessionService', 'Root.Data',
    function($q, users, games, teams, leagues, session, rootData) {
        var promisedGames = $q.defer();
        var currentUser = session.currentUser;

        games.getList({
            indexerFirstName: currentUser.firstName,
            indexerLastName: currentUser.lastName
        }, function(indexerGames) {
            var filteredGames = indexerGames.filter(function(game) {
                return game.isAssignedToUser(currentUser.id);
            });
            promisedGames.resolve(filteredGames);
        });

        var promises = {
            users: users.getList().$promise,
            teams: teams.getList().$promise,
            leagues: leagues.getList().$promise,
            games: promisedGames.promise,
            sports: rootData.sports
        };

        return promises;
    }
]);



/**
 * Games controller.
 * @module Games
 * @name Controller
 * @type {Controller}
 */
Games.controller('indexer-games.Controller', [
    '$scope', '$state', '$localStorage', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'SessionService', 'Indexer.Games.Data',
    function controller($scope, $state, $localStorage, GAME_TYPES, teams, leagues, games, session, data) {

        $scope.currentUser = session.currentUser;
        $scope.data = data;
        $scope.moment = moment;

        angular.forEach($scope.data.games, function(game) {
            game.timeLeft = new Date(game.currentAssignment().deadline) - new Date();
        });
    }
]);
