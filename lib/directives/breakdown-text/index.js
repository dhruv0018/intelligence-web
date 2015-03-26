/* Constants */
var TO = '';
var ELEMENT = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * BreakdownText
 * @module BreakdownText
 */
var BreakdownText = angular.module('BreakdownText', []);

/**
 * BreakdownText directive.
 * @module BreakdownText
 * @name BreakdownText
 * @type {directive}
 */
BreakdownText.directive('breakdownText', [
    function directive() {

        var retObj = {

            restrict: TO += ELEMENT,

            scope: {
                remainingBreakdowns: '=',
                planName: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            function getBreakdownText() {
                if ($scope.remainingBreakdowns.planGamesRemaining <= 0 && $scope.remainingBreakdowns.packageGamesRemaining <= 0) {
                    $scope.remainingBreakdownsString = 'You currently do not have any breakdowns. Talk to your sales rep to order more breakdowns.';
                } else if ($scope.remainingBreakdowns.planGamesRemaining > 0) {
                    $scope.remainingBreakdownsString = 'You have ' + $scope.remainingBreakdowns.planGamesRemaining + ' breakdowns left this week under your ' + $scope.planName + ' Plan';

                    if ($scope.remainingBreakdowns.packageGamesRemaining > 0) {
                        $scope.remainingBreakdownsString += ', as well as ' + $scope.remainingBreakdowns.packageGamesRemaining + ' extra games if you go over your weekly limit.';
                    } else {
                        $scope.remainingBreakdownsString += '.';
                    }
                } else {
                    if ($scope.remainingBreakdowns.packageGamesRemaining >= 0) {
                        if ($scope.planName) {
                            $scope.remainingBreakdownsString = 'You have no breakdowns left this week under your ' + $scope.planName + ' Plan, but you can use one of your ' + $scope.remainingBreakdowns.packageGamesRemaining + ' extra breakdowns for this game.';
                        } else {
                            $scope.remainingBreakdownsString = 'You have ' + $scope.remainingBreakdowns.packageGamesRemaining + ' breakdowns remaining.';
                        }
                    }
                }
                return $scope.remainingBreakdownsString;
            }

            $scope.$watch('remainingBreakdowns', function(newRemainingBreakdowns) {
                element.text(getBreakdownText());
            });

            element.text(getBreakdownText());
        }

        return retObj;
    }
]);
