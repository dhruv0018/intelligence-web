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
    'AdminGamesService',
    'AdminQueueDashboardService',
    'GamesFactory'
];

function AdminQueueDataDependencies (
    VIEWS,
    ROLE_TYPE,
    sports,
    leagues,
    AdminGames,
    AdminQueueDashboardService,
    games
) {
    class AdminQueueData{
        constructor() {
        }
        gather() {
            let filter = Object.assign({}, AdminQueueDashboardService.ALL_QUEUE_GAMES);
            AdminGames.queryFilter = filter;
            AdminGames.start = 0;
            var Data = {
                games: AdminGames.query(),
                sports: sports.load(),
                leagues: leagues.load(),
                filterCounts: games.getQueueDashboardCounts()
            };
            return Data;
        }
    }
    return AdminQueueData;
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
                        function($q, AdminQueueData) {
                            let data = new AdminQueueData();
                            return $q.all(data.gather());
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
    'Utilities',
    'AdminGamesService',
    'AdminQueueDashboardService',
    'AdminGamesEventEmitter',
    'EVENT',
    'VIDEO_STATUSES'
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
    utilities,
    AdminGames,
    AdminQueueDashboardService,
    AdminGamesEventEmitter,
    EVENT,
    VIDEO_STATUSES
) {

    $scope.ROLE_TYPE = ROLE_TYPE;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.data = data;
    $scope.dashboardFilterCounts = data.filterCounts;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();

    $scope.sportsList = sports.getList();
    $scope.teamsList = teams.getList();
    $scope.usersList = users.getList();
    $scope.QUERY_SIZE = VIEWS.QUEUE.GAME.QUERY_SIZE;
    $scope.AdminGames = AdminGames;
    $scope.queue = data.games;

    $scope.emptyOutQueue = () => {
        $scope.queue = [];
        $scope.noResults = true;
        $scope.searching = false;
    };

    AdminGamesEventEmitter.on(EVENT.ADMIN.QUERY.COMPLETE, (event, games) =>  {
        if (games.length === 0) {
            $scope.emptyOutQueue();
        } else {
            $scope.queue = games;
        }
    });

    $scope.search = function(filter) {
        $scope.searching = true;
        $scope.noResults = false;

        let updateQueue = (games) => {
            if (!games.length) {
                games = [games];
            }
            $scope.queue = games;
        };

        let removeSpinner = () => {
            $scope.noResults = false;
            $scope.searching = false;
            //Notify Angular to start digest cycle
            $scope.$digest();
        };

        //can't use filter directly because manipulating it would change the UI
        const parsedFilter = Object.assign({}, filter, AdminQueueDashboardService.BASE_QUEUE_FILTER);
        if (parsedFilter['id[]']) {
            parsedFilter['id[]'] = [parsedFilter['id[]']];
        }
        AdminGames.queryFilter = parsedFilter;
        AdminGames.start = 0;
        AdminGames.query().then().finally(removeSpinner);
    };

    $scope.$on('$destroy', () => {
        AdminGames.queryFilter = null;
        AdminGames.start = 0;
    });
}
