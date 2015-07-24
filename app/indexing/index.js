/* Fetch angular from the browser scope */
var angular = window.angular;

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
    'Item',
    'Event',
    'Events',
    'Play',
    'Playlist'
]);

/* Cache the template file */
Indexing.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/template.html', require('./template.html'));
        $templateCache.put('indexing/header.html', require('./header.html'));
        $templateCache.put('indexing/sidebar-notes.html', require('./sidebar-notes.html'));
        $templateCache.put('indexing/sidebar-playlist.html', require('./sidebar-playlist.html'));
        $templateCache.put('indexing/modal-delete-play.html', require('./modal-delete-play.html'));
        $templateCache.put('indexing/modal-send-to-team.html', require('./modal-send-to-team.html'));
        $templateCache.put('indexing/modal-add-indexer-note.html', require('./modal-add-indexer-note.html'));
    }
]);

/**
 * Indexing data dependencies.
 * @module Indexing
 * @type {service}
 */
Indexing.service('Indexing.Data.Dependencies', [
    'SessionService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'TagsetsFactory',
    function(session, games, teams, leagues, tagsets) {

        var Data = {

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
                        templateUrl: 'indexing/header.html',
                        controller: 'Indexing.Header.Controller'
                    },
                    'main@root': {
                        templateUrl: 'indexing/template.html',
                        controller: 'Indexing.Main.Controller',
                        controllerAs: 'main'
                    },
                    'sidebar-notes@indexing': {
                        templateUrl: 'indexing/sidebar-notes.html',
                        controller: 'Indexing.Sidebar.Notes.Controller'
                    },
                    'sidebar-playlist@indexing': {
                        templateUrl: 'indexing/sidebar-playlist.html',
                        controller: 'Indexing.Sidebar.Playlist.Controller'
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

                            $state.go('indexer-games');
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

                                    $state.go('indexer-game', { id: game.id });
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

                        Mousetrap.bind('enter', function() {

                            $timeout(() => indexing.index());

                            return false;
                        });

                        Mousetrap.bind('tab', function() {

                            $timeout(() => indexing.step());

                            return false;
                        });

                        Mousetrap.bind('esc', function() {

                            $timeout(() => indexing.back());

                            return false;
                        });

                        //Used primarily to go back when indexing in fullscreen
                        Mousetrap.bind('shift+backspace', function() {

                            $timeout(() => indexing.back());

                            return false;
                        });
                    }
                ],

                onExit: [
                    function() {

                        Mousetrap.unbind('left');
                        Mousetrap.unbind('right');
                        Mousetrap.unbind('enter');
                        Mousetrap.unbind('tab');
                        Mousetrap.unbind('esc');
                        Mousetrap.unbind('shift+backspace');
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

/* File dependencies. */
require('./header-controller');
require('./main-controller');
require('./sidebar-notes-controller');
require('./sidebar-playlist-controller');
require('./modal-delete-play-controller');
require('./modal-send-to-team-controller');
require('./modal-add-indexer-note-controller');
