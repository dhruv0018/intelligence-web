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
Indexing.controller('Indexing.Sidebar.Notes.Controller', ['$scope', 'GAME_NOTE_TYPES',
    function controller($scope, GAME_NOTE_TYPES) {
		
		$scope.noteValues = ['Camera did not follow play', 'Jersey not visible', 'Gap in film', 'Scoreboard shot', 'Other'];
		
		$scope.selectedNoteText = $scope.noteValues[0];
		
		$scope.editSaveNote = function() {
			
			var noteValueToSave = $scope.selectedNoteText;

			if ($scope.selectedNoteText === $scope.noteValues[$scope.noteValues.length-1]) {
				noteValueToSave = $scope.otherNoteValue;
			}

			$scope.indexing.game.notes[GAME_NOTE_TYPES.INDEXER_NOTE] =  [{
				'content': noteValueToSave,
				'gameId': $scope.indexing.game.id,
				'noteTypeId': GAME_NOTE_TYPES.INDEXER_NOTE,
				'id': $scope.indexing.game.id,
				'gameTime': $scope.VideoPlayer.videoElement[0].currentTime,
			}];

			$scope.indexing.game.save();

		};
    }
]);

