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
                    'ROLES',
                    'Utilities',
                    function(
                        $q,
                        $stateParams,
                        schools,
                        teams,
                        games,
                        users,
                        ROLES,
                        utilities
                    ) {

                        const gameId = Number($stateParams.id);
                        const gamePromise = games.load(gameId);
                        let game;

                        // Wait for the game until requesting teams, users, and school
                        gamePromise.then(results => {

                            game = results[0];
                            let gameTeamIds = [
                                game.teamId,
                                game.opposingTeamId,
                                game.uploaderTeamId
                            ];
                            gameTeamIds = utilities.unique(gameTeamIds);

                            // Request each of the game's teams
                            const teamsPromise = teams.load({ 'id[]': gameTeamIds });
                            /**
                             * FIXME: If I use the above promise, I cannot factory.get the
                             * team in the controller. WTF. Sorry
                             */
                            // const teamsPromise = $q.all({
                            //     team: teams.load(game.teamId),
                            //     opposingTeam: teams.load(game.opposingTeamId),
                            //     uploaderTeam: teams.load(game.uploaderTeamId)
                            // });

                            return teamsPromise;


                        }).then(() => {

                            const uploaderTeam = teams.get(game.uploaderTeamId);
                            let usersPromise, schoolsPromise;

                            // Request indexer assignments' users
                            if (game.indexerAssignments) {

                                let userIds = game.indexerAssignments.map(assignment => assignment.userId);

                                // Also get the effin head coach
                                const headCoachRole = uploaderTeam.roles.filter(role => role.type.id === ROLES.HEAD_COACH.type.id)[0];
                                const headCoachUserId = headCoachRole.userId;
                                userIds.push(headCoachUserId);

                                usersPromise = users.load({ 'id[]': userIds});
                            }

                            // Request the uploader team's school
                            if (uploaderTeam.schoolId) {

                                schoolsPromise = schools.load(uploaderTeam.schoolId);
                            }

                            return $q.all([usersPromise, schoolsPromise]);
                        });

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
