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
        $templateCache.put('select-indexer.html', require('./select-indexer.html'));
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
 * Modal controller. Controls the modal views.
 * @module Queue
 * @name ModalController
 * @type {Controller}
 */
Queue.controller('ModalController', [
    '$rootScope', '$scope', '$state', '$modal', '$modalInstance', '$localStorage', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $modalInstance, $localStorage, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, sports, leagues, teams, users) {

        $scope.ok = function () {

            $modalInstance.close();
        };

        $scope.cancel = function () {

            $modalInstance.dismiss('cancel');
        };
    }
]);

/**
 * Queue controller. Controls the view for displaying the queue.
 * @module Queue
 * @name QueueController
 * @type {Controller}
 */
Queue.controller('QueueController', [
    '$rootScope', '$scope', '$state', '$modal', '$localStorage', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $localStorage, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, sports, leagues, teams, users) {

        $scope.ROLE_TYPE = ROLE_TYPE;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;

        sports.getList(function(sports) { $scope.sports = sports; }, null, true);
        leagues.getList(function(leagues) { $scope.leagues = leagues; }, null, true);
        teams.getList(function(teams) { $scope.teams = teams; }, null, true);
        users.getList(function(users) { $scope.users = users; }, null, true);
        $scope.queue = games.getList();

        $scope.selectIndexer = function(game, isQa) {

            $scope.selectedGame = game;
            $scope.isQa = isQa;

            $modal.open({

                scope: $scope,
                controller: 'ModalController',
                templateUrl: 'select-indexer.html'

            }).result.then(function() {

                $scope.selectedGame.save().then(function() {

                    $scope.queue = games.getList();
                });
            });
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

