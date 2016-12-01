/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/breakdown-rating/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var BreakdownRating = angular.module('breakdown-rating', []);

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
BreakdownRating.directive('breakdownRating', [
    '$timeout', 'SessionService',
    function directive($timeout, session) {

        var breakdownRating = {

            restrict: TO += ELEMENTS,

            replace: true,

            transclude: true,

            scope: {
                gameId: '=',
            },

            link: link,

            templateUrl: templateUrl
        };

        function link(scope, element, attributes) {
            scope.popup = {
                isOpen: false,
                isDismissed: false
            };
            scope.data = {
                userId: session.currentUser.id,
                gameId: scope.gameId,
                roleId: session.currentUser.getCurrentRole().id
            };
            scope.previousRating = null;

            let submittingRating = false;

            scope.submitRating = function(event) {
                // Create a new BreakdownRating and submit it.  Form data is in scope.data.rating, data.notes
                submittingRating = true;

                scope.something = true;
                console.log("Breakdown Rating submitted");

                scope.previousRating = scope.data.rating;
                // Close the popup after submitting
                $timeout(function () {
                    scope.popup.isOpen = false;
                },1800);

                submittingRating = true;
            };
        }

        return breakdownRating;
    }
]);

export default BreakdownRating;
