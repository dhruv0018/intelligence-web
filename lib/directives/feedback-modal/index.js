/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

var templateUrl = 'lib/directives/feedback-modal/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FeedbackModal
 * @module FeedbackModal
 */
var FeedbackModal = angular.module('FeedbackModal', []);


/**
 * FeedbackModal directive.
 * @module FeedbackModal
 * @name FeedbackModal
 * @type {directive}
 */
FeedbackModal.directive('feedbackModal', [
    function directive() {

        var feedbackModal = {

            restrict: TO += ATTRIBUTES,

            replace: false,

            transclude: false,

            link: link,

            controller: 'FeedbackModal.controller'
        };

        function link($scope, element, attributes) {
            element.on('click', function(event) {
                $scope.openModal();
            });
        }

        return feedbackModal;
    }
]);

/**
 * FeedbackModal controller.
 * @module FeedbackModal
 * @name FeedbackModal.controller
 * @type {controller}
 */
FeedbackModal.controller('FeedbackModal.controller', [
    '$scope', '$uibModal', 'GAME_NOTE_TYPES', 'GamesFactory',
    function controller($scope, $uibModal, GAME_NOTE_TYPES, games) {

        $scope.feedbackNoteValue = ($scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] && $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE].length > 0) ? $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].content : '';

        $scope.openModal = function() {
            var modalInstace = $uibModal.open({
                scope: $scope,
                size: 'sm',
                resolve: {
                    resolvedGame: function() {
                        return $scope.game;
                    }
                },
                templateUrl,
                controller: ModalInstanceCtrl
            });

            modalInstace.result.then(function(noteValue) {

                $scope.feedbackNoteValue = noteValue;

                var newCoachFeedbackNote = {
                    content: noteValue,
                    gameId: $scope.game.id,
                    noteTypeId: GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE
                };

                $scope.game.notes = $scope.game.notes || {};
                $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] || [];

                if ($scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE].length > 0 && typeof $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].id !== 'undefined') {
                    newCoachFeedbackNote.id = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].id;
                }

                $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0] = newCoachFeedbackNote;

                $scope.game.save();

            });

            return modalInstace.opened;
        };
    }
]);

var ModalInstanceCtrl = [
    '$scope', '$uibModalInstance',
    function($scope, $uibModalInstance) {

        $scope.ok = function(value) {
            $uibModalInstance.close(value);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

    }
];

export default FeedbackModal;
