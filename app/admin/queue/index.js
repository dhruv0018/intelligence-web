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
    'GamesFactory'
];

function AdminQueueDataDependencies (
    VIEWS,
    ROLE_TYPE,
    sports,
    leagues,
    AdminGames,
    games
) {
    let filter = angular.copy(VIEWS.QUEUE.GAME.ALL);
    AdminGames.queryFilter = filter;
    AdminGames.start = 0;
    var Data = {
        sports: sports.load(),
        leagues: leagues.load(),
        games : AdminGames.query(),
        filterCounts: games.getQueueDashboardCounts(),
        totalGameCount: games.totalCount(VIEWS.QUEUE.GAME.ALL)
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
    'Utilities',
    'AdminGamesService',
    'AdminGamesEventEmitter',
    'EVENT'
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
    AdminGamesEventEmitter,
    EVENT
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

    $scope.games = games.getList(VIEWS.QUEUE.GAME.ALL);
    $scope.totalGameCount = data.totalGameCount;

    $scope.QUERY_SIZE = VIEWS.QUEUE.GAME.QUERY_SIZE;

    $scope.AdminGames = AdminGames;

    //initially show everything
    $scope.queue = $scope.games;

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

    AdminGamesEventEmitter.on(EVENT.ADMIN.GAME_COUNT.UPDATE, filter => {
        games.totalCount(filter)
            .then(count => $scope.totalGameCount = count);
    });

    $scope.search = function(filter) {
        let parsedFilter = AdminGames.cleanUpFilter(filter);

        $scope.searching = true;
        $scope.noResults = false;

        let updateQueue = (games) => {
            if (!games.length) {
                games = [games];
            }
            $scope.queue = games;
        };

        let extractUserIdsFromTeams = AdminGames.extractUserIdsFromTeams;
        let extractUserIdsFromGame = AdminGames.extractUserIdsFromGame;
        let extractTeamIdsFromGame = AdminGames.extractTeamIdsFromGame;

        let removeSpinner = () => {
            $scope.noResults = false;
            $scope.searching = false;
            //Notify Angular to start digest cycle
            $scope.$digest();
        };

        if (parsedFilter['id[]']) {
            parsedFilter['id[]'] = [parsedFilter['id[]']];
        }
        AdminGames.queryFilter = parsedFilter;
        AdminGames.start = 0;
        AdminGames.query().then().finally(removeSpinner);
    };
}
