/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name Modal.AddIndexerNote.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Modal.AddIndexerNote.Controller', [
    '$scope', '$modalInstance', 'GAME_NOTE_TYPES', 'UsersFactory',
    function controller($scope, $modalInstance, GAME_NOTE_TYPES, users) {
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        var qaNote = {
            noteTypeId: GAME_NOTE_TYPES.QA_NOTE,
            content: ''
        };

        $scope.game.notes = $scope.game.notes || {};
        $scope.game.notes[GAME_NOTE_TYPES.QA_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.QA_NOTE] || [qaNote];

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = users.get(headCoachRole.userId);
        }

        $scope.submit = function() {
            $scope.game.saveNotes().then(function() {
                $modalInstance.close();
            });
        };
    }
]);

