/* File dependencies. */
require('./game.js');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Queue page module.
 * @module Queue
 */
var Queue = angular.module('queue', [
    'ui.router',
    'ui.bootstrap',
    'game'
]);

/* Cache the template file */
Queue.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('queue.html', require('./queue.html'));
    }
]);

/**
 * Queue page state router.
 * @module Queue
 * @type {UI-Router}
 */
Queue.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('queue', {
                url: '/queue',
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'queue.html',
                        controller: 'QueueController'
                    }
                }
            });
    }
]);

/**
 * Queue controller. Controls the view for displaying the queue.
 * @module Queue
 * @name QueueController
 * @type {Controller}
 */
Queue.controller('QueueController', [
    '$rootScope', '$scope', '$state', '$localStorage', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $localStorage, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, sports, leagues, teams, users) {

        $scope.ROLE_TYPE = ROLE_TYPE;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;

        sports.getList(function(sports) { $scope.sports = sports; }, null, true);
        leagues.getList(function(leagues) { $scope.leagues = leagues; }, null, true);
        teams.getList(function(teams) { $scope.teams = teams; }, null, true);
        users.getList(function(users) { $scope.users = users; }, null, true);
        $scope.queue = games.getList();

        $scope.gameStatus = function(game) {

            var status = GAME_STATUSES[GAME_STATUS_IDS[game.status]];

            /* If the game is in set aside status. */
            if (status.id === GAME_STATUSES.SET_ASIDE.id) {

                /* If the game was assigned to an indexer. */
                if (game.isAssignedToIndexer(game.currentAssignment())) {

                    status.name += ', from indexing';
                }

                /* If the game was assigned to QA. */
                else if (game.isAssignedToQa(game.currentAssignment())) {

                    status.name += ', from QA';
                }
            }

            return status.name;
        };

        $scope.search = function(filter) {

            /* If search by ID is used, just pull the single game. */
            if (filter.gameId) {

                games.get(filter.gameId,

                    function success(game) {

                        $scope.queue = [];
                        $scope.queue[0] = game;
                        $scope.noResults = false;
                    },

                    function error() {

                        $scope.queue = [];
                        $scope.noResults = true;
                    }
                );
            }

            else {

                games.getList(filter,

                    function success(games){

                        $scope.queue = games;
                        $scope.noResults = false;
                    },

                    function error(){

                        $scope.queue = [];
                        $scope.noResults = true;
                    }
                );
            }
        };
    }
]);

