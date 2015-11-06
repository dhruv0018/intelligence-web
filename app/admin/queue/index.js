/* File dependencies. */
require('./game.js');
var moment = require('moment');

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
Queue.service('Admin.Queue.Data.Dependencies', AdminQueueDataDependencies);

AdminQueueDataDependencies.$inject = [
    'VIEWS',
    'ROLE_TYPE',
    'SportsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'UsersFactory'
];

function AdminQueueDataDependencies (
    VIEWS,
    ROLE_TYPE,
    sports,
    leagues,
    teams,
    games,
    users
) {
    var Data = {
        sports: sports.load(),
        leagues: leagues.load(),
        //TODO should be able to use load, but causes wierd caching issues
        users: users.load(VIEWS.QUEUE.USERS),
        teams: teams.load(VIEWS.QUEUE.TEAMS),
        priority1Games : games.load(VIEWS.QUEUE.GAME.PRIORITY_1),
        priority2Games : games.load(VIEWS.QUEUE.GAME.PRIORITY_2),
        priority3Games : games.load(VIEWS.QUEUE.GAME.PRIORITY_3)
    };
    return Data;
}

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
    '$rootScope', '$scope', '$state', '$modal', '$modalInstance', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $modalInstance, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, sports, leagues, teams, users) {

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

Queue.controller('QueueController', QueueController);

QueueController.$inject = [
    '$interval',
    '$rootScope',
    '$scope',
    '$state',
    '$modal',
    '$filter',
    'ROLE_TYPE',
    'GAME_STATUS_IDS',
    'GAME_STATUSES',
    'VIEWS',
    'GAME_TYPES',
    'UsersFactory',
    'SportsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'Admin.Queue.Data',
    'SelectIndexer.Modal',
    'Utilities'
];

function QueueController (
    $interval,
    $rootScope,
    $scope,
    $state,
    $modal,
    $filter,
    ROLE_TYPE,
    GAME_STATUS_IDS,
    GAME_STATUSES,
    VIEWS,
    GAME_TYPES,
    users,
    sports,
    leagues,
    teams,
    games,
    data,
    SelectIndexerModal,
    utilities
) {

    $scope.ROLE_TYPE = ROLE_TYPE;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.SelectIndexerModal = SelectIndexerModal;

    $scope.data = data;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();

    $scope.sportsList = sports.getList();
    $scope.teamsList = teams.getList();
    $scope.usersList = users.getList();

    $scope.games = games.getList(VIEWS.QUEUE.GAME.PRIORITY_3)
        .concat(games.getList(VIEWS.QUEUE.GAME.PRIORITY_2))
        .concat(games.getList(VIEWS.QUEUE.GAME.PRIORITY_1));

    //initially show everything
    $scope.queue = $scope.games;

    var refreshGames = function() {

        angular.forEach($scope.queue, function(game) {

            if (game.remainingTime) {

                game.remainingTime = moment.duration(game.remainingTime).subtract(1, 'minute').asMilliseconds();
            }
        });
    };

    var ONE_MINUTE = 60000;

    var refreshGamesInterval = $interval(refreshGames, ONE_MINUTE);

    $scope.$on('$destroy', function() {

        $interval.cancel(refreshGamesInterval);
    });

    $scope.search = function(filter) {

        $scope.searching = true;

        /* If search by ID is used, just pull the single game. */
        if (filter.gameId) {

            games.fetch(filter.gameId,

                function success(game) {

                    /* Get the team names */
                    teams.load([game.teamId, game.opposingTeamId]).then(
                        function updateQueue() {
                            $scope.queue = [];
                            $scope.queue[0] = game;
                    }).finally(function removeSpinner() {
                        $scope.noResults = false;
                        $scope.searching = false;
                        //Notify Angular to start digest cycle
                        $scope.$digest();
                    });
                },

                function error() {

                    $scope.queue = [];
                    $scope.noResults = true;
                    $scope.searching = false;
                    //Notify Angular to start digest cycle
                    $scope.$digest();
                }
            );
        }

        else {

            games.query(filter,

                function success(games) {

                    let teamIds = [];
                    /* Get the team names */
                    for (let game of games) {
                        teamIds.push(game.teamId, game.opposingTeamId);
                    }
                    /* Get the unique teams */
                    teams.load(teamIds).then(
                        function updateQueue() {
                            $scope.queue = games;
                    }).finally(function removeSpinner() {
                        $scope.noResults = false;
                        $scope.searching = false;
                        //Notify Angular to start digest cycle
                        $scope.$digest();
                    });
                },

                function error() {

                    $scope.queue = [];
                    $scope.noResults = true;
                    $scope.searching = false;
                    //Notify Angular to start digest cycle
                    $scope.$digest();
                }
            );
        }
    };
}
