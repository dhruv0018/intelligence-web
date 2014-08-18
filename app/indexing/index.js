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
                    '$state', '$stateParams', 'SessionService', 'Indexing.Data', 'IndexingService',
                    function($state, $stateParams, session, data, indexingService) {

                        indexingService.IS_INDEXING_STATE = true;
                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = data.games.get(gameId);
                        var status = game.getStatus();
                        var indexable = game.isAssignedToIndexer() && game.canBeIndexed();
                        var qaAble = game.isAssignedToQa() && game.canBeQAed();

                        if (game.isAssignedToUser(userId) && (indexable || qaAble) && !game.isDeleted) {

                            if (!game.isAssignmentStarted()) {

                                game.startAssignment(userId);
                                game.save();
                            }
                        }

                        else $state.go('401');
                    }
                ],
                onExit: [
                    function() {

                        Mousetrap.unbind('space');
                        Mousetrap.unbind('left');
                        Mousetrap.unbind('right');
                        Mousetrap.unbind('enter');
                        Mousetrap.unbind('esc');
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

