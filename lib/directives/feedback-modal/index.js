/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

var templateUrl = 'feedbackModal.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FeedbackModal
 * @module FeedbackModal
 */
var FeedbackModal = angular.module('FeedbackModal', []);

/* Cache the template file */
FeedbackModal.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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
    '$scope', '$modal', 'GAME_NOTE_TYPES', 'GamesFactory',
    function controller($scope, $modal, GAME_NOTE_TYPES, games) {

        //wait for $scope.game to load before giving modal functionality
        $scope.openModal = function() {};

        //TODO: once game has a resolve on it this watch can be removed, and assume
        //game is always loaded
        $scope.$watch('game', function(newValue, oldValue) {

            if (typeof newValue !== 'undefined' && typeof oldValue === 'undefined') {
                $scope.feedbackNoteValue = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].content;

                $scope.openModal = function() {
                    var modalInstace = $modal.open({
                        scope: $scope,
                        size: 'sm',
                        resolve: {
                            resolvedGame: function() {
                                return $scope.game;
                            }
                        },
                        templateUrl: 'feedbackModal.html',
                        controller: ModalInstanceCtrl
                    });

                    modalInstace.result.then(function(noteValue) {

                        var newCoachFeedbackNote = {
                            content: noteValue,
                            gameId: $scope.game.id,
                            noteTypeId: GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE
                        };

                        if (typeof $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].id !== 'undefined') {
                            newCoachFeedbackNote.id = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0].id;
                        }

                        $scope.game.notes = $scope.game.notes || {};
                        $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] || [];
                        $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE][0] = newCoachFeedbackNote;

                        $scope.game.saveNotes();

                    });

                    return modalInstace.opened;
                };
            }
        });
    }
]);

var ModalInstanceCtrl = function($scope, $modalInstance) {

    $scope.ok = function(value) {
        $modalInstance.close(value);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };

};
