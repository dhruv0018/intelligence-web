/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingModalAddIndexerNoteController.$inject = [
    '$scope',
    '$uibModalInstance',
    'GAME_NOTE_TYPES',
    'UsersFactory'
];

/** *Modal controller. Controls the modal view.
 * @module Indexing
 * @name IndexingModalAddIndexerNoteController
 * @type {Controller}
 */
function IndexingModalAddIndexerNoteController($scope, $uibModalInstance, GAME_NOTE_TYPES, users) {
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
        $scope.game.save().then(function() {
            $uibModalInstance.close();
        });
    };
}

export default IndexingModalAddIndexerNoteController;
