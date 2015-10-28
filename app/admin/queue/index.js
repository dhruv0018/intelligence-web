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
        games: games.load(VIEWS.QUEUE.GAME)
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
    $scope.games = games.getList(VIEWS.QUEUE.GAME);

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
            console.log(teamIds);
            return teamIds;
        };

        let removeSpinner = () => {
            $scope.noResults = false;
            $scope.searching = false;
            //Notify Angular to start digest cycle
            $scope.$digest();
        };

        /* If search by ID is used, just pull the single game. */
        //FIXME this entire section of code is very dirty, we should invest time into separating this search component
        //into a directive and cleaning up this code.
        if (filter.gameId) {

            games.fetch(filter.gameId,

                function success(game) {
                    let teamIds = extractTeamIdsFromGame(game);
                    let userIdsFromGame = extractUserIdsFromGame(game);
                    /* Get the team names */
                    teams.load(teamIds).then((teams) => {
                        let userIdsFromTeam = extractUserIdsFromTeams(teams);
                        let userIds = userIdsFromGame.concat(userIdsFromTeam);
                        users.load(userIds).then(() => updateQueue([game])).finally(removeSpinner);
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
