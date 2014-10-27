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
    '$scope', '$rootScope', 'GAME_NOTE_TYPES', 'VG_EVENTS', 'GamesFactory', 'VideoPlayerInstance', 'PlayManager', 'VG_STATES',
    function controller($scope, $rootScope, GAME_NOTE_TYPES, VG_EVENTS, games, videoPlayerInstance, playManager, VG_STATES) {

        var Mousetrap = window.Mousetrap;
        var videoPlayer = videoPlayerInstance.promise;
        $scope.savingNotes = false;
        $scope.playManager = playManager;
        $scope.VG_STATES = VG_STATES;

        $scope.noteValues = ['Camera did not follow play', 'Jersey not visible', 'Gap in film', 'Scoreboard shot', 'Other'];

        $scope.selectedNoteText = $scope.noteValues[0];
        $scope.currentTimestamp = 0;

        $rootScope.$on(VG_EVENTS.ON_PAUSE, function() {
            videoplayer.then(function(vp) {
                $scope.currentTimestamp = window.Math.floor(vp.videoElement[0].currentTime);
            });
        });

        $scope.saveIndexingNote = function() {

            $scope.savingNotes = true;
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
            $scope.game.saveNotes().then(function(savedNotes) {
                $scope.savingNotes = false;
                $scope.game.notes = savedNotes;
            });
        };
    }
]);

