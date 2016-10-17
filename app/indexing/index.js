/* Fetch angular from the browser scope */
var angular = window.angular;

import IndexingHeaderController from './header-controller';
import IndexingMainController from './main-controller';
import IndexingSidebarNotesController from './sidebar-notes-controller';
import IndexingSidebarPlaylistController from './sidebar-playlist-controller';

/* Template paths */
const IndexingTemplateUrl = 'app/indexing/template.html';
const IndexingHeaderTemplateUrl = 'app/indexing/header.html';
const IndexingSideBarNotesTemplateUrl = 'app/indexing/sidebar-notes.html';
const IndexingSideBarPlayListTemplateUrl = 'app/indexing/sidebar-playlist.html';

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing', [
    'ui.router',
    'ui.bootstrap',
    'ui.showhide',
    'Event',
    'Events',
    'Play',
    'Playlist'
]);

/**
 * Indexing data dependencies.
 * @module Indexing
 * @type {service}
 */
Indexing.service('Indexing.Data.Dependencies', [
    'SessionService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'TagsetsFactory', 'SportsFactory',
    function(session, games, teams, leagues, tagsets, sports) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            tagsets: tagsets.load(),

            get teams() {

                var userId = session.currentUser.id;

                return teams.load({ relatedUserId: userId });
            },

            get games() {

                var userId = session.currentUser.id;

                return games.load({ assignedUserId: userId });
            }
        };

        return Data;
    }
]);

/**
 * Indexing page state router.
 * @module Indexing
 * @type {UI-Router}
 */
Indexing.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexing', {
                url: '/indexing/:id',
                parent: 'root',
                views: {
                    'header@root': {
                        templateUrl: IndexingHeaderTemplateUrl,
                        controller: IndexingHeaderController
                    },
                    'main@root': {
                        templateUrl: IndexingTemplateUrl,
                        controller: IndexingMainController,
                        controllerAs: 'main'
                    },
                    'sidebar-notes@indexing': {
                        templateUrl: IndexingSideBarNotesTemplateUrl,
                        controller: IndexingSidebarNotesController
                    },
                    'sidebar-playlist@indexing': {
                        templateUrl: IndexingSideBarPlayListTemplateUrl,
                        controller: IndexingSidebarPlaylistController
                    }
                },
                resolve: {
                    'Indexing.Data': [
                        '$q', '$stateParams', 'Indexing.Data.Dependencies', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory',
                        function($q, $stateParams, data, teams, games, players, plays) {

                            return $q.all(data).then(function(data) {

                                var gameId = Number($stateParams.id);
                                var game = games.get(gameId);

                                var team = teams.get(game.teamId);
                                var opposingTeam = teams.get(game.opposingTeamId);

                                var teamRoster = game.getRoster(team.id);
                                var opposingTeamRoster = game.getRoster(opposingTeam.id);

                                var gameData = {

                                    game: game,
                                    plays: plays.load({ gameId: gameId }),
                                    players: players,
                                    team: teams.load(game.uploaderTeamId),
                                    teamPlayers: players.load({ rosterId: teamRoster.id }),
                                    opposingTeamPlayers: players.load({ rosterId: opposingTeamRoster.id })
                                };

                                return $q.all(angular.extend(data, gameData));
                            });

                        }
                    ]
                },

                onEnter: [
                    '$state', '$timeout', '$stateParams', 'SessionService', 'BasicModals', 'Indexing.Data', 'IndexingService', 'GamesFactory', 'PlayerlistManager',
                    function($state, $timeout, $stateParams, session, modals, data, indexing, games, playerlist) {

                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = games.get(gameId);
                        playerlist.fill(game);
                        if (!game.isAssignedToUser(userId)) {

                            $state.go('IndexerGamesAssigned');
                        }

                        else if (game.canBeIndexed() || game.canBeQAed()) {

                            if (!game.isAssignmentStarted()) {

                                game.startAssignment(userId);
                                game.save();
                            }

                            var timeRemaining = game.assignmentTimeRemaining();

                            var timeExpired = function() {

                                var timeExpiredModal = modals.openForAlert({
                                    title: 'Alert',
                                    bodyText: 'The deadline to index this game has passed.'
                                });

                                timeExpiredModal.result.finally(function() {

                                    $state.go('IndexerGame', { id: game.id });
                                });
                            };

                            $timeout(timeExpired, timeRemaining);

                            indexing.IS_INDEXING_STATE = true;
                        }

                        var globalCallbacks = {
                            'space': true,
                            'left': true,
                            'right': true,
                            'enter': true,
                            'tab': true,
                            'esc': true,
                            'shift+backspace': true
                        };

                        var originalStopCallback = Mousetrap.stopCallback;

                        Mousetrap.stopCallback = function(event, element, combo, sequence) {

                            if (Mousetrap.krossoverIsPaused) {
                                return true;
                            }

                            $timeout(function() {
                                if (indexing.isIndexing) {

                                    if (globalCallbacks[combo] || globalCallbacks[sequence]) {
                                        return false;
                                    }
                                }

                                return originalStopCallback(event, element, combo);

                            }, 0);
                        };

                        //Used primarily to go back when indexing in fullscreen
                        Mousetrap.bind('shift+backspace', function() {

                            $timeout(() => indexing.back());

                            return false;
                        });
                }
                ],

                onExit: [
                    function() {

                        // Unbind all Mousetrap handlers
                        Mousetrap.reset();
                    }
                ]
            });
    }
]);

/**
 * Sidebar toggle values
 * @module Indexing
 * @name Sidebar
 * @type {Value}
 */
Indexing.value('Indexing.Sidebar', {

    notes: false,
    playlist: true
});
