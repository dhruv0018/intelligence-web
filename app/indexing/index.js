/* Fetch angular from the browser scope */

var angular = window.angular;

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
    'Plays'
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
    'Indexer.Games.Data.Dependencies', 'TeamsFactory', 'LeaguesFactory', 'TagsetsFactory',
    function(data, teams, leagues, tagsets) {

        var Data = {

            games: data.games,
            teams: teams.load(),
            leagues: leagues.load(),
            tagsets: tagsets.load()
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
                        '$q', '$stateParams', 'Indexing.Data.Dependencies', 'PlayersFactory', 'PlaysFactory',
                        function($q, $stateParams, data, players, plays) {

                            return $q.all(data).then(function(data) {

                                var gameId = $stateParams.id;
                                var game = data.games.get(gameId);

                                var team = data.teams.get(game.teamId);
                                var opposingTeam = data.teams.get(game.opposingTeamId);

                                var teamRoster = game.getRoster(team.id);
                                var opposingTeamRoster = game.getRoster(opposingTeam.id);

                                var gameData = {

                                    game: game,
                                    plays: plays.query({ gameId: gameId }),
                                    players: players,
                                    teamPlayers: players.query({ rosterId: teamRoster.id }),
                                    opposingTeamPlayers: players.query({ rosterId: opposingTeamRoster.id })
                                };

                                return $q.all(angular.extend(data, gameData));
                            });

                        }
                    ]
                },

                onEnter: [
                    '$state', '$timeout', '$stateParams', 'SessionService', 'BasicModals', 'Indexing.Data', 'IndexingService', 'VideoPlayerInstance',
                    function($state, $timeout, $stateParams, session, modals, data, indexing, Videoplayer) {

                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = data.games.get(gameId);

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


                        Mousetrap.bind('space', function() {

                            indexing.playPause();

                            return false;
                        });

                        Mousetrap.bind('left', function() {

                            indexing.jumpBack();

                            return false;
                        });

                        Mousetrap.bind('right', function() {

                            indexing.jumpForward();

                            return false;
                        });

                        Mousetrap.bind('enter', function() {

                            if (indexing.isIndexing) {

                                if (indexing.savable()) indexing.save();
                                else if (indexing.nextable()) indexing.next();
                                else indexing.step();
                            }

                            else if (indexing.isReady) indexing.index();

                            return false;
                        });

                        Mousetrap.bind('tab', function() {

                            indexing.step();

                            return false;
                        });

                        Mousetrap.bind('esc', function() {

                            indexing.back();

                            return false;
                        });
                    }
                ],

                onExit: [
                    '$stateParams', 'GamesFactory', 'PlaysManager',
                    function($stateParams, games, playsManager) {

                        var gameId = $stateParams.id;
                        var game = games.get(gameId);

                        Mousetrap.unbind('space');
                        Mousetrap.unbind('left');
                        Mousetrap.unbind('right');
                        Mousetrap.unbind('enter');
                        Mousetrap.unbind('esc');

                        game.save();
                        playsManager.save();
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
require('./filters');
require('./header-controller');
require('./main-controller');
require('./sidebar-notes-controller');
require('./sidebar-playlist-controller');
require('./modal-delete-play-controller');
require('./modal-send-to-team-controller');
require('./modal-add-indexer-note-controller');

