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
    '$window', '$scope', '$state', '$stateParams', '$modal', 'GAME_STATUSES', 'SessionService', 'IndexingService', 'Indexing.Sidebar', 'Indexing.Data',
    function controller($window, $scope, $state, $stateParams, $modal, GAME_STATUSES, session, indexing, sidebar, data) {

        $scope.GAME_STATUSES = GAME_STATUSES;

        var gameId = $stateParams.id;
        var userId = session.currentUser.id;

        $scope.game = data.games.get(gameId);
        $scope.team = data.teams.get($scope.game.teamId);
        $scope.league = data.leagues.get($scope.team.leagueId);

        $scope.sidebar = sidebar;

        $scope.indexing = indexing;

        $scope.goBack = function() {

            $scope.game.save();
            $state.go('indexer-game', { id: $scope.game.id });
        };

        $scope.sendToQa = function() {

            $scope.game.finishAssignment(userId);
            $scope.game.save().then(function() {
                $state.go('indexer-games');
            });


        };

        $scope.sendToTeam = function() {

            $modal.open({

                controller: 'Indexing.Modal.SendToTeam.Controller',
                templateUrl: 'indexing/modal-send-to-team.html'

            }).result.then(function() {

                $scope.game.finishAssignment(userId);
                $scope.game.save();

                $modal.open({

                    controller: 'Indexing.Modal.AddIndexerNote.Controller',
                    templateUrl: 'indexing/modal-add-indexer-note.html'

                }).result.then(function() {

                    $scope.game.save();

                    $state.go('indexer-games');
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

