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
    '$window', '$scope', '$state', 'GAME_STATUSES', 'IndexingService', 'Indexing.Sidebar',
    function controller($window, $scope, $state, GAME_STATUSES, indexing, sidebar) {

        $scope.sidebar = sidebar;

        $scope.indexing = indexing;

        $scope.goBack = function() {

            $scope.indexing.game.save();
            $state.go('indexer-game', { id: $scope.indexing.game.id });
        };

        $scope.sendToQa = function() {

            $scope.indexing.game.status = GAME_STATUSES.READY_FOR_QA.id;
            $scope.goBack();
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

