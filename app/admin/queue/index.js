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
    'SessionService',
    'AdminQueueDashboardService',
    'GamesFactory',
    'IndexerFactory'
];

function AdminQueueDataDependencies (
    VIEWS,
    ROLE_TYPE,
    sports,
    leagues,
    AdminGames,
    session,
    AdminQueueDashboardService,
    games,
    indexerFactory
) {

    class AdminQueueData{
        constructor() {
        }
        gather() {
            let filter = Object.assign({}, AdminQueueDashboardService.ALL_QUEUE_GAMES);
            AdminGames.queryFilter = filter;
            AdminGames.start = 0;
            let currentUser = session.getCurrentUser();
            var Data = {
                games: AdminGames.query(),
                sports: sports.load(),
                leagues: leagues.load(),
                filterCounts: games.getQueueDashboardCounts(),
                indexerGroups: indexerFactory.getIndexerGroups(),
                userPermissions: currentUser.getUserPermissions()
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
    'RunDistribution.Modal',
    'Utilities',
    'AdminGamesService',
    'AdminQueueDashboardService',
    'GamesResolutionEventEmitter',
    'EVENT',
    'VIDEO_STATUSES',
    'USER_PERMISSIONS'
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
    RunDistributionModal,
    utilities,
    AdminGames,
    AdminQueueDashboardService,
    GamesResolutionEventEmitter,
    EVENT,
    VIDEO_STATUSES,
    USER_PERMISSIONS
) {

    $scope.ROLE_TYPE = ROLE_TYPE;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.data = data;
    $scope.dashboardFilterCounts = data.filterCounts;
    $scope.indexerGroups = data.indexerGroups.data;
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

    //User permissions
    $scope.hasDistributionPermissions = data.userPermissions.data.some(permission => {
        return permission.attributes.action === USER_PERMISSIONS.EXECUTE_DISTRIBUTION.action;
    });

    $scope.emptyOutQueue = () => {
        $scope.queue = [];
        $scope.noResults = true;
        $scope.searching = false;
    };

    GamesResolutionEventEmitter.on(EVENT.ADMIN.QUERY.COMPLETE, (event, games) =>  {
        if (games.length === 0) {
            $scope.emptyOutQueue();
        } else {
            $scope.queue = games;
        }
    });

    $scope.$on('select-dashboard-filter', event => $scope.selectedIndexerGroup = null);

    $scope.filterByIndexerGroup = function(selectedIndexerGroup) {
        let filter = {
            'status[]': [
                GAME_STATUSES.READY_FOR_INDEXING.id,
                GAME_STATUSES.READY_FOR_QA.id,
                GAME_STATUSES.INDEXING.id,
                GAME_STATUSES.QAING.id
            ]
        };
        if (selectedIndexerGroup) {
            filter.indexerGroupId = selectedIndexerGroup.id;
        }

        $scope.search(filter);
    };

    $scope.onSearchClick = function(filter) {
        $scope.selectedIndexerGroup = null;
        $scope.search(filter);
    };

    $scope.search = function(filter) {

        GamesResolutionEventEmitter.emit(EVENT.ADMIN.DASHBOARD.RESET_FILTERS);

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

    $scope.openDistrubutionModal = function() {
        RunDistributionModal.open($scope.indexerGroups).result(() => {
            $scope.filterByIndexerGroup();
        });
    };
}
