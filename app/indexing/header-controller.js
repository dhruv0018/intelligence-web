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
    '$window', '$scope', '$state', '$stateParams', '$modal', 'GAME_STATUSES', 'SessionService', 'IndexingService', 'Indexing.Sidebar', 'Indexing.Data', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'PlaysManager',
    function controller($window, $scope, $state, $stateParams, $modal, GAME_STATUSES, session, indexing, sidebar, data, leagues, teams, games, playsManager) {

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

        const watchLastPlayIndexedScore = $scope.$watch('playsManager.plays[playsManager.plays.length-1].indexedScore', function onLastPlayIndexedScoreChange (indexedScore) {

            if (angular.isDefined(indexedScore)) {

                $scope.game.indexedScore = indexedScore;
            }
        });

        const watchLastPlayOpposingIndexedScore = $scope.$watch('playsManager.plays[playsManager.plays.length-1].opposingIndexedScore', function onLastPlayOpposingIndexedScoreChange (opposingIndexedScore) {

            if (angular.isDefined(opposingIndexedScore)) {

                $scope.game.opposingIndexedScore = opposingIndexedScore;
            }
        });

        $scope.$on('$destroy', onDestroy);

        function onDestroy () {

            watchLastPlayIndexedScore();
            watchLastPlayOpposingIndexedScore();

            $scope.game.save();
        }

        $scope.sendToQa = function() {

            indexing.isIndexing = false;
            $scope.game.finishAssignment(userId);
            $scope.game.save();
            $state.go('IndexerGames');
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
                        $state.go('IndexerGames');
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
