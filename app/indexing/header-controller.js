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
    '$window', '$scope', '$state', '$modal', 'GAME_STATUSES', 'SessionService', 'IndexingService', 'Indexing.Sidebar',
    function controller($window, $scope, $state, $modal, GAME_STATUSES, session, indexing, sidebar) {

        $scope.GAME_STATUSES = GAME_STATUSES;

        $scope.sidebar = sidebar;

        $scope.indexing = indexing;

        $scope.goBack = function() {

            $scope.indexing.game.save();
            $state.go('indexer-game', { id: $scope.indexing.game.id });
        };

        $scope.sendToQa = function() {

            var game = $scope.indexing.game;
            var userId = session.currentUser.id;

            game.finishAssignment(userId);

            game.save().then(function() {

                $state.go('indexer-games');
            });
        };

        $scope.sendToTeam = function() {

            $modal.open({

                controller: 'Indexing.Modal.SendToTeam.Controller',
                templateUrl: 'indexing/modal-send-to-team.html'

            }).result.then(function() {

                var userId = session.currentUser.id;

                $scope.indexing.game.finishAssignment(userId);

                $modal.open({

                    controller: 'Indexing.Modal.AddIndexerNote.Controller',
                    templateUrl: 'indexing/modal-add-indexer-note.html'

                }).result.then(function() {

                    $scope.indexing.game.save().then(function() {

                        $state.go('indexer-games');
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
