/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/breakdown-rating/template.html';

/**
 * BreakdownRating
 * @module BreakdownRating
 */
var BreakdownRating = angular.module('breakdown-rating', []);

/**
 * BreakdownRating directive.
 * @module BreakdownRating
 * @name BreakdownRating
 * @type {Directive}
 */
BreakdownRating.directive('breakdownRating', [
    '$timeout', 'SessionService', 'AlertsService', 'v3BreakdownRatingsFactory',
    function directive($timeout, session, alerts, breakdownRatings) {

        var breakdownRating = {

            restrict: TO += ELEMENTS,

            replace: true,

            transclude: true,

            scope: {
                gameId: '=',
            },

            link: {
                pre: pre,
                post: post
            },

            templateUrl: templateUrl
        };

        function pre(scope) {
            scope.data = {
                userId: session.currentUser.id,
                gameId: scope.gameId,
                roleId: session.currentUser.getCurrentRole().id
            };
            scope.previousRating = null;
            scope.init = false;

            // Check for a previous rating made by this user on this game
            breakdownRatings.load({gameId: scope.data.gameId, userId: scope.data.userId}).then(function (prevRating) {
                if (prevRating.length) {
                    scope.previousRating = prevRating[0].attributes.rating;
                }
                scope.init = true;
            });
        }

        function post(scope, element, attributes) {
            scope.popup = {
                isOpen: false,
                isDismissed: false
            };

            // Flag to disable submit buttons when rating is being submitted
            scope.submittingRating = false;

            scope.submitRating = function(event) {
                // Don't submit if we have a previous rating
                if (scope.previousRating !== null) {
                    return;
                }

                scope.submittingRating = true;

                let data = angular.copy(scope.data);
                let newRating = breakdownRatings.create(data);

                newRating.save().then(function (rating) {
                    if (rating === undefined) {
                        alerts.add({
                            type: 'danger',
                            message: 'Error Saving Breakdown Rating'
                        });
                        return;
                    }

                    scope.previousRating = data.rating;
                })
                .finally(function() {
                    scope.submittingRating = false;
                });
            };

            scope.clearForm = function () {
                delete scope.data.rating;
                delete scope.data.notes;
            };
        }

        return breakdownRating;
    }
]);

export default BreakdownRating;
