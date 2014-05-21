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
    '$scope', '$rootScope', 'GAME_NOTE_TYPES', 'VG_EVENTS',
    function controller($scope, $rootScope, GAME_NOTE_TYPES, VG_EVENTS) {

        $scope.noteValues = ['Camera did not follow play', 'Jersey not visible', 'Gap in film', 'Scoreboard shot', 'Other'];

        $scope.selectedNoteText = $scope.noteValues[0];
        $scope.currentTimestamp = 0;

        $rootScope.$on(VG_EVENTS.ON_PAUSE, function() {
            $scope.currentTimestamp = window.Math.floor($scope.VideoPlayer.videoElement[0].currentTime);
            $scope.$apply();
        });

        $scope.editSaveNote = function() {

            var noteValueToSave = $scope.selectedNoteText;

            if ($scope.selectedNoteText === $scope.noteValues[$scope.noteValues.length - 1]) {
                noteValueToSave = $scope.otherNoteValue;
            }

            $scope.indexing.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE].push({
                'content': noteValueToSave,
                'gameId': $scope.indexing.game.id,
                'noteTypeId': GAME_NOTE_TYPES.INDEXER_NOTE,
                'gameTime': $scope.currentTimestamp
            });

            $scope.indexing.game.save();
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
