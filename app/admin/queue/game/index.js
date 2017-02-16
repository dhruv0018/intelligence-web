const angular = window.angular;

/**
 * Game info page module.
 * @module Game
 */
const Game = angular.module('game', []);

/**
 * Game page state router.
 * @module Game
 * @type {UI-Router}
 */
Game.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const game = {
            name: 'game',
            url: '/game/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/admin/queue/game/game.html',
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

                        /**
                         * @param {Array<GamesResource>} gamesPromiseResults
                         * @returns {Promise} teamsPromise
                         */
                        function loadGameTeams(gamesPromiseResults) {

                            game = gamesPromiseResults[0];

                            let gameTeamIds = [
                                game.teamId,
                                game.opposingTeamId,
                                game.uploaderTeamId
                            ];
                            gameTeamIds = utilities.unique(gameTeamIds);

                            return teams.load({ 'id[]': gameTeamIds });
                        }

                        /**
                         * @param {Array<TeamsResource>} teamsPromiseResults
                         * @param {Promise} usersAndSchoolsPromise
                         */
                        function loadGameUsersAndSchool(teamsPromiseResults) {

                            const uploaderTeam = teams.get(game.uploaderTeamId);

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

                            userIds.push(game.uploaderUserId);

                            if (headCoachRole) {

                                userIds.push(headCoachRole.userId);
                            }

                            return users.load({ 'id[]': userIds });
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

                        return gamePromise
                            .then(loadGameTeams)
                            .then(loadGameUsersAndSchool);
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
Game.controller('GameController', [ '$scope', '$stateParams', 'GamesFactory', 'AlertsService', 'EMAILS',
    function controller($scope, $stateParams, games, alerts, EMAILS) {

            const gameId = $stateParams.id;

            $scope.game = games.get(gameId);

            if ($scope.game.isDeleted) {
                alerts.add({
                    type: 'danger',
                    message: 'This game has been deleted. For more info contact <a href="mailto:'+EMAILS.OPERATIONS+'">'+EMAILS.OPERATIONS+'</a>'
                });
            }
        }
    ]
);

export default Game;
