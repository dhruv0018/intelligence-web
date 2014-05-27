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
    '$scope', '$rootScope', 'GAME_NOTE_TYPES', 'VG_EVENTS', 'GamesFactory',
    function controller($scope, $rootScope, GAME_NOTE_TYPES, VG_EVENTS, games) {

        var Mousetrap = window.Mousetrap;

        //adding mousetrap pause and unpause functionality
        //should be pulled out as moustrap extension
        Mousetrap = (function enablePause(Mousetrap) {
            var mt = Mousetrap;
            var originalStopCallback = mt.stopCallback;
            var enabled = true;

            mt.stopCallback = function(e, element, combo) {
                if (!enabled) {
                    return true;
                }

                return originalStopCallback(e, element, combo);
            };

            mt.pause = function() {
                enabled = false;
            };

            mt.unpause = function() {
                enabled = true;
            };

            return mt;
        })(Mousetrap);

        $scope.noteValues = ['Camera did not follow play', 'Jersey not visible', 'Gap in film', 'Scoreboard shot', 'Other'];

        $scope.selectedNoteText = $scope.noteValues[0];
        $scope.currentTimestamp = 0;

        $rootScope.$on(VG_EVENTS.ON_PAUSE, function() {
            $scope.currentTimestamp = window.Math.floor($scope.VideoPlayer.videoElement[0].currentTime);
            $scope.$apply();
        });

        $scope.clearKeyListeners = function() {
            Mousetrap.pause();
        };

        $scope.unclearKeyListeners = function(element) {
            Mousetrap.unpause();
        };

        $scope.saveIndexingNote = function() {

            var noteValueToSave = $scope.selectedNoteText;

            if ($scope.selectedNoteText === $scope.noteValues[$scope.noteValues.length - 1]) {
                noteValueToSave = $scope.otherNoteValue;
                $scope.otherNoteValue = '';
            }

            var newIndexingNote = {
                content: noteValueToSave,
                gameId: $scope.indexing.game.id,
                noteTypeId: GAME_NOTE_TYPES.INDEXER_NOTE,
                gameTime: $scope.currentTimestamp
            };

            $scope.indexing.game.notes = $scope.indexing.game.notes || {};
            $scope.indexing.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE] = $scope.indexing.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE] || [];
            $scope.indexing.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE].push(newIndexingNote);

            //there is still a race condition bug here that if the user clicks send to qa
            //or back button the game will be saved to the server again with
            //the notes still not having id's and the notes will be created twice
            //the following code would need to be atomic to prevent that from happening
            $scope.indexing.game.saveNotes();
        };
    }
]);

Indexing.filter('secondsToTime', function() {
    return function(secondsInput) {
        var floor = window.Math.floor;
        var minutes = floor(secondsInput / 60);
        var seconds = floor(secondsInput%60);
        var output = minutes;
        output += ':';
        output += (floor(secondsInput%60) < 10) ? '0' : '';
        output += seconds;
        return output;
    };
});
