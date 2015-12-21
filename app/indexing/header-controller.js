/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Indexing header controller.
 * @module Indexing
 * @name Header.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Header.Controller', [
    '$window',
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'GAME_STATUSES',
    'SPORTS',
    'SessionService',
    'IndexingService',
    'Indexing.Sidebar',
    'Indexing.Data',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'PlaysManager',
    'PlaylistEventEmitter',
    'EVENT',
    'SendToQaDialog.Service',
    'AlertsService',
    '$mdDialog',
    function controller(
        $window,
        $scope,
        $state,
        $stateParams,
        $modal,
        GAME_STATUSES,
        SPORTS,
        session,
        indexing,
        sidebar,
        data,
        leagues,
        teams,
        games,
        playsManager,
        playlistEventEmitter,
        EVENT,
        SendToQaDialogService,
        alerts,
        $mdDialog
    ) {

        $scope.GAME_STATUSES = GAME_STATUSES;

        var gameId = $stateParams.id;
        var userId = session.currentUser.id;

        $scope.game = games.get(gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        $scope.league = leagues.get($scope.team.leagueId);

        $scope.sidebar = sidebar;

        $scope.indexing = indexing;

        $scope.playsManager = playsManager;


        playlistEventEmitter.on(EVENT.PLAYLIST.PLAYS.CALCULATE, onCalculatePlays);

        function onCalculatePlays (plays) {

            const lastPlayIndex = plays.length - 1;
            const lastPlay = plays[lastPlayIndex];

            $scope.game.indexedScore = lastPlay ? lastPlay.indexedScore : 0;
            $scope.game.opposingIndexedScore = lastPlay ? lastPlay.opposingIndexedScore : 0;
        }

        $scope.$on('$destroy', onDestroy);

        function onDestroy () {

            playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAYS.CALCULATE, onCalculatePlays);

            $scope.game.save();
        }

        $scope.sendToQa = function() {

            indexing.isIndexing = false;
            $scope.game.finishAssignment(userId);
            const onSuccess = (game) => {
                $scope.game.extend(game);
                $mdDialog.hide();
                $state.go('IndexerGamesAssigned').then( () => {
                    alerts.add({
                        type: 'success',
                        message: 'Send to QA Successful'
                    });
                });
            };

            const onFailure = () => {
                alerts.add({
                    type: 'danger',
                    message: 'Send to QA Unsuccessful'
                });
            };
            return $scope.game.save(null, onSuccess, onFailure);
        };

        $scope.launchSendToQaModal = function() {
            let isBasketballGame = $scope.league.sportId === SPORTS.BASKETBALL.id;
            let isLacrosseGame = $scope.league.sportId === SPORTS.LACROSSE.id;
            let locals = {
                'sendToQa': $scope.sendToQa,
                'flagsUrl': $scope.game.getFlagsUrl(),
                //show the flags only for basketball
                'showFlags': isBasketballGame || isLacrosseGame
            };
            let modal = SendToQaDialogService.show(locals);
        };

        $scope.sendToTeam = function() {
            indexing.isIndexing = false;
            $modal.open({

                controller: 'Indexing.Modal.SendToTeam.Controller',
                templateUrl: 'indexing/modal-send-to-team.html'

            }).result.then(function() {

                $scope.game.finishAssignment(userId);

                $scope.game.save().then(function() {
                    $modal.open({

                        controller: 'Indexing.Modal.AddIndexerNote.Controller',
                        templateUrl: 'indexing/modal-add-indexer-note.html',
                        scope: $scope
                    }).result.then(function() {
                        $scope.game.save();
                        $state.go('IndexerGamesAssigned');
                    });
                });
            });
        };

        $scope.toggleNotes = function() {

            sidebar.notes = !sidebar.notes;
            sidebar.playlist = false;

            $scope.$watch('sidebar.notes', function() {

                $scope.$evalAsync(function() {

                    angular.element($window).triggerHandler('resize');
                });
            });
        };

        $scope.togglePlaylist = function() {

            sidebar.notes = false;
            sidebar.playlist = !sidebar.playlist;

            $scope.$watch('sidebar.playlist', function() {

                $scope.$evalAsync(function() {

                    angular.element($window).triggerHandler('resize');
                });
            });
        };
    }
]);
