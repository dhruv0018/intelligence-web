/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGame = angular.module('IndexerGame', []);

import IndexerDataDependencies from '../data';
import IndexerGameController from './controller';
import template from './template.html';

IndexerGame.factory('IndexerDataDependencies', IndexerDataDependencies);
IndexerGame.controller('IndexerGameController', IndexerGameController);

/**
 * Indexer game page state router.
 * @module Game
 * @type {UI-Router}
 */
IndexerGame.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerGame', {
                url: '/game/:id',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        template,
                        controller: IndexerGameController
                    }
                },
                //FIXME: Copy resolve from Admin.Game -- to reconsider during game-info refactor
                resolve: {
                    'Indexer.Game.Data': [
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
                    '$state', '$stateParams', 'SessionService', 'AlertsService', 'Indexer.Game.Data', 'GamesFactory',
                    function($state, $stateParams, session, alerts, data, games) {
                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = games.get(gameId);
                        var status = game.getStatus();
                        var indexable = game.isAssignedToIndexer() && game.canBeIndexed();
                        var qaAble = game.isAssignedToQa() && game.canBeQAed();

                        if (game.isAssignedToUser(userId) && (indexable || qaAble) && !game.isDeleted) {

                            alerts.add({
                                type: status.type,
                                message: status.name
                            });
                        }

                        else $state.go('401');
                    }
                ]
            });
    }
]);

export default IndexerGame;
