/* Component settings */
var templateUrl = 'game.html';

/* Component resources */
var template = require('./game.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module Game
 */
var Game = angular.module('game', []);

/* Cache the template file */
Game.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('select-indexer.html', require('./select-indexer.html'));
    }
]);

/**
 * Game page state router.
 * @module Game
 * @type {UI-Router}
 */
Game.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var game = {
            name: 'game',
            url: '/game/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'game.html',
                    controller: 'GameController'
                }
            },
            resolve: {
                'Admin.Game.Data': [
                    '$q',
                    '$stateParams',
                    'SchoolsFactory',
                    'TeamsFactory',
                    'GamesFactory',
                    'UsersFactory',
                    'Utilities',
                    function(
                        $q,
                        $stateParams,
                        schools,
                        teams,
                        games,
                        users,
                        utilities
                    ) {

                        const gameId = Number($stateParams.id);
                        const gamePromise = games.load(gameId);
                        let game;

                        gamePromise
                            .then(loadGameTeams)
                            .then(loadGameUsersAndSchool);

                        /**
                         * @param {Array<Resource>} gamesPromiseResults
                         * @returns {Promise} teamsPromise
                         */
                        function loadGameTeams(gamesPromiseResults) {

                            game = gamesPromiseResults[0];

                            // let gameTeamIds = [
                            //     game.teamId,
                            //     game.opposingTeamId,
                            //     game.uploaderTeamId
                            // ];
                            // gameTeamIds = utilities.unique(gameTeamIds);
                            // const teamsPromise = teams.load({ 'id[]': gameTeamIds });
                            /**
                             * FIXME: If I use the above promise, I cannot factory.get the
                             * team in the controller. WTF. Sorry
                             */
                            const teamsPromise = $q.all([
                                teams.fetch(game.teamId),
                                teams.fetch(game.opposingTeamId),
                                teams.fetch(game.uploaderTeamId)
                            ]);

                            return teamsPromise;
                        }

                        /**
                         * @param {Array<Resource>} teamsPromiseResults
                         * @param {Promise} usersAndSchoolsPromise
                         */
                        function loadGameUsersAndSchool(teamsPromiseResults) {

                            const uploaderTeam = teams.get(game.uploaderTeamId);
                            console.log(`teams.get(${game.uploaderTeamId})`, uploaderTeam);

                            return $q.all([
                                loadTeamUsers(game, uploaderTeam),
                                loadTeamSchool(uploaderTeam)
                            ]);
                        }

                        /**
                         * @param {GameResource} game
                         * @param {TeamResource} team
                         * @returns {Promise} users
                         */
                        function loadTeamUsers(game, team) {

                            let userIds = [];
                            const headCoachRole = team.getHeadCoachRole();

                            if (game.indexerAssignments) {

                                userIds = game.indexerAssignments.map(assignment => assignment.userId);
                            }

                            if (headCoachRole) {

                                userIds.push(headCoachRole.userId);
                            }

                            return users.load({ 'id[]': userIds});
                        }

                        /**
                         * @param {TeamsResource} team
                         * @returns {Promise | undefined} school
                         */
                        function loadTeamSchool(team) {

                            if (team.schoolId) {

                                return schools.load(team.schoolId);
                            }
                        }

                        return gamePromise;
                    }
                ]
            },
            onEnter: [
                '$stateParams', 'GAME_STATUSES', 'AlertsService', 'Admin.Game.Data', 'GamesFactory',
                function($stateParams, GAME_STATUSES, alerts, data, games) {

                    var gameId = $stateParams.id;

                    var game = games.get(gameId);

                    alerts.add({
                        type: game.isDelivered() ? 'success' : 'warning',
                        message: game.getStatus()
                    });
                }
            ]
        };

        $stateProvider.state(game);
    }
]);

/**
 * Game controller.
 * @module Game
 * @name GameController
 * @type {Controller}
 */
Game.controller('GameController', [
    '$scope', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'RawFilm.Modal', 'DeleteGame.Modal', 'SelectIndexer.Modal', 'UsersFactory', 'SportsFactory', 'SchoolsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'RevertGameStatus.Modal',
    function controller($scope, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES, RawFilmModal, DeleteGameModal, SelectIndexerModal, users, sports, schools, leagues, teams, games, RevertGameStatusModal) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.DeleteGameModal = DeleteGameModal;
        $scope.RawFilmModal = RawFilmModal;
        $scope.SelectIndexerModal = SelectIndexerModal;
        $scope.RevertGameStatusModal = RevertGameStatusModal;

        var gameId = $stateParams.id;

        $scope.game = games.get(gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.teams = teams.getCollection();
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        $scope.league = leagues.get($scope.team.leagueId);
        $scope.sport = sports.get($scope.league.sportId);

        const uploaderTeam = teams.get($scope.game.uploaderTeamId);
        if (uploaderTeam.schoolId) {
            $scope.school = schools.get(uploaderTeam.schoolId);
        }

        $scope.users = users.getList();

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = users.get(headCoachRole.userId);
        }

        $scope.deliverTime = $scope.game.timeRemaining();
        if ($scope.deliverTime === 0) {
            $scope.deliverTime = 'None';
        }

        $scope.assignedToIndexer = $scope.game.isAssignedToIndexer();
        $scope.assignedToQa = $scope.game.isAssignedToQa();

        $scope.indexTime = $scope.game.assignmentTimeRemaining();

        $scope.gameLength = Math.round($scope.game.video.duration);

        var uploadedDate = new Date($scope.game.createdAt);
        $scope.uploadDate = (uploadedDate.getMonth() + 1) + '/' + uploadedDate.getDate() + '/' + uploadedDate.getFullYear();
    }
]);
