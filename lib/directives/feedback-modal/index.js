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
var FeedbackModal = angular.module('FeedbackModal', [
    'ui.bootstrap'
]);

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
                console.log($scope);
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
    '$scope', '$modal', 'GAME_NOTE_TYPES',
    function controller($scope, $modal, GAME_NOTE_TYPES) {

        console.log('$scope');
        console.log($scope);

        $scope.feedbackNoteValue = '';

        $scope.saveAdminCoachFeedback = function() {

            var noteValue = $scope.feedbackNoteValue;
            $scope.feedbackNoteValue = '';

            var newCoachFeedbackNote = {
                content: noteValue,
                gameId: $scope.game.id,
                noteTypeId: GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE
            };

            $scope.game.notes = $scope.game.notes || {};
            $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE] || [];
            $scope.game.notes[GAME_NOTE_TYPES.COACH_FEEDBACK_NOTE].push(newCoachFeedbackNote);
            $scope.apply();
            console.log('$scope2');
            console.log($scope);
        };

        $scope.openModal = function() {
            $modal.open({
                scope: $scope,
                templateUrl: 'feedbackModal.html',
                controller: 'FeedbackModal.controller'
            });
            //feedbackModal.open({});
        };
    }
]);
