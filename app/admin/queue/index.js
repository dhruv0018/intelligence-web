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
 * Admin Queue data dependencies.
 * @module Queue
 * @type {service}
 */
Queue.service('Admin.Queue.Data.Dependencies', [
    'ROLE_TYPE', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'UsersFactory',
    function(ROLE_TYPE, sports, leagues, teams, games, users) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            teams: teams.load(),
            games: games.load(),
            users: users.load()
        };

        return Data;
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
                },
                resolve: {
                    'Admin.Queue.Data': [
                        '$q', 'Admin.Queue.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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

        $scope.ok = function() {

            $modalInstance.close();
        };

        $scope.cancel = function() {

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
    '$rootScope', '$scope', '$state', '$modal', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'Admin.Queue.Data', 'SelectIndexer.Modal',
    function controller($rootScope, $scope, $state, $modal, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, data, SelectIndexerModal) {

        $scope.ROLE_TYPE = ROLE_TYPE;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;

        $scope.SelectIndexerModal = SelectIndexerModal;

        $scope.data = data;
        $scope.sports = data.sports.getCollection();
        $scope.leagues = data.leagues.getCollection();
        $scope.teams = data.teams.getCollection();
        $scope.users = data.users.getCollection();

        $scope.sportsList = data.sports.getList();
        $scope.teamsList = data.teams.getList();
        $scope.usersList = data.users.getList();
        $scope.queue = data.games.getList();

        $scope.search = function(filter) {

            /* If search by ID is used, just pull the single game. */
            if (filter.gameId) {

                games.fetch(filter.gameId,

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

                games.query(filter,

                    function success(games) {

                        $scope.queue = games;
                        $scope.noResults = false;
                    },

                    function error() {

                        $scope.queue = [];
                        $scope.noResults = true;
                    }
                );
            }
        };
    }
]);

