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
    '$scope', '$modalInstance', 'GAME_NOTE_TYPES', 'IndexingService', 'TeamsFactory', 'UsersFactory',
    function controller($scope, $modalInstance, GAME_NOTE_TYPES, indexing, teams, users) {

        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        var qaNote = {
            noteTypeId: GAME_NOTE_TYPES.QA_NOTE,
            content: ''
        };

        indexing.game.notes = indexing.game.notes || {};
        indexing.game.notes[GAME_NOTE_TYPES.QA_NOTE] = indexing.game.notes[GAME_NOTE_TYPES.QA_NOTE] || [qaNote];

        $scope.game = indexing.game;

        teams.get(indexing.team.id, function(team) {

            var headCoachRole = team.getHeadCoachRole();

            if (headCoachRole) {

                users.get(headCoachRole.userId, function(user) {

                    $scope.headCoach = user;
                });
            }
        });

        $scope.submit = function() {
            $scope.game.saveNotes().then(function() {
                $modalInstance.close();
            });
        };
    }
]);

