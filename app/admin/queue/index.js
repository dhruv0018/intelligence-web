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
        games : games.load(VIEWS.QUEUE.GAME.ALL)
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
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();

    $scope.sportsList = sports.getList();
    $scope.teamsList = teams.getList();
    $scope.usersList = users.getList();

    $scope.games = games.getList(VIEWS.QUEUE.GAME.ALL);

    //initially show everything
    $scope.queue = $scope.games;

    AdminGames.start = 0;
    AdminGames.queryFilter = {
        count:10,
        isDeleted:false,
        'status[]': [8,2,3,4],
        videoStatus: 4
    };
    AdminGames.query();
    AdminGamesEventEmitter.on(EVENT.ADMIN.QUERY.COMPLETE, () =>  {
        console.log('responded');
        let filter = angular.copy(AdminGames.queryFilter);
        filter.start = AdminGames.start;
        $scope.queue = games.getList(filter);
        $scope.$apply();
    });

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
        let parsedFilter = {};

        Object.keys(filter).forEach(key => {
            let value = filter[key];
            let isNull = value === null;
            let isEmptyString = typeof value === 'string' && value.length === 0;

            //strips out nulls and empty strings
            if (isNull || isEmptyString) return;

            parsedFilter[key] = value;
        });

        $scope.searching = true;
        $scope.noResults = false;

        let updateQueue = (games) => {
            $scope.queue = games;
        };

        //TODO should belong to indexing game model
        //leaving this open to potentially getting other info from the team besides head coach id
        let extractUserIdsFromTeams = (teams) => {
            let headCoachIds = teams.map(team => {
                let headCoachRole = team.getHeadCoachRole();
                return headCoachRole ? headCoachRole.userId : null;
            }).filter(id => id !== null);
            return headCoachIds;
        };

        //TODO this should belong to an indexing game model
        let extractUserIdsFromGame = (game) => {
            //indexer related ids
            let userIds = game.indexerAssignments.map(assignment => assignment.userId);
            userIds.push(game.uploaderUserId);
            return userIds;
        };

        //TODO this should belong to an indexing game model
        let extractTeamIdsFromGame = (game) => {
            let teamIds = [game.teamId, game.opposingTeamId, game.uploaderTeamId];
            return teamIds;
        };

        let removeSpinner = () => {
            $scope.noResults = false;
            $scope.searching = false;
            //Notify Angular to start digest cycle
            $scope.$digest();
        };

        let success = (games) => {
            games = Array.isArray(games) ? games : [games];

            if (games.length === 0) {
                emptyOutQueue();
                return;
            }

            let teamIds = [];
            let userIdsFromGames = [];
            games.forEach(game => {
                teamIds = teamIds.concat(extractTeamIdsFromGame(game));
                userIdsFromGames = userIdsFromGames.concat(extractUserIdsFromGame(game));
            });
            /* Get the team names */
            teams.load(teamIds).then((teams) => {
                let userIdsFromTeams = extractUserIdsFromTeams(teams);
                let userIds = userIdsFromGames.concat(userIdsFromTeams);
                users.load(userIds).then(() => updateQueue(games)).finally(removeSpinner);
            });
        };

        let emptyOutQueue = () => {
            $scope.queue = [];
            $scope.noResults = true;
            $scope.searching = false;
            //Notify Angular to start digest cycle
            $scope.$digest();
        };


        if (parsedFilter.gameId) {
            games.fetch(parsedFilter.gameId, success, emptyOutQueue);
        } else {
            games.query(parsedFilter, success, emptyOutQueue);
        }
    };
}
