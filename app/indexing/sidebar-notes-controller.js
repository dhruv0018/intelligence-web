/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Indexing notes sidebar controller.
 * @module Indexing
 * @name Sidebar.Notes.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Sidebar.Notes.Controller', [
    '$scope', '$rootScope', 'GAME_NOTE_TYPES', 'GamesFactory', 'VideoPlayer',
    function controller($scope, $rootScope, GAME_NOTE_TYPES, games, videoPlayer) {

        var Mousetrap = window.Mousetrap;

        $scope.noteValues = ['Camera did not follow play', 'Jersey not visible', 'Gap in film', 'Scoreboard shot', 'Other'];
        $scope.otherNoteValue = '';
        $scope.selectedNoteText = $scope.noteValues[0];
        $scope.currentTimestamp = 0;

        $scope.clearKeyListeners = function clearKeyListeners() {
            Mousetrap.pause();
        };

        $scope.unclearKeyListeners = function unclearKeyListeners() {
            Mousetrap.unpause();
        };

        $scope.saveIndexingNote = function() {

            videoPlayer.pause();

            $scope.currentTimestamp = window.Math.floor(videoPlayer.mediaElement[0].currentTime);

            var noteValueToSave = $scope.selectedNoteText;

            if ($scope.selectedNoteText === $scope.noteValues[$scope.noteValues.length - 1]) {
                noteValueToSave = $scope.otherNoteValue;
                $scope.otherNoteValue = '';
            }

            var newIndexingNote = {
                content: noteValueToSave,
                gameId: $scope.game.id,
                noteTypeId: GAME_NOTE_TYPES.INDEXER_NOTE,
                gameTime: $scope.currentTimestamp
            };

            $scope.game.notes = $scope.game.notes || {};
            $scope.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE] || [];
            $scope.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE].push(newIndexingNote);

            //there is still a race condition bug here that if the user clicks send to qa
            //or back button the game will be saved to the server again with
            //the notes still not having id's and the notes will be created twice
            //the following code would need to be atomic to prevent that from happening
            $scope.game.saveNotes().then(function(updatedNotes) {
                $scope.game.notes = updatedNotes;
            });
        };
    }
]);
