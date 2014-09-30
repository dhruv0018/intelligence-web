/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete
 * @module Athlete
 */
var Athlete = angular.module('athlete', [
    'ui.router',
    'ui.bootstrap',
    'profile-placeholder'
]);

/* Cache the template file */
Athlete.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('athlete.html', require('./template.html'));
    }
]);

/**
 * Athlete directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Athlete.directive('krossoverAthlete', [
    'PlayersFactory',
    function directive(players) {

        var athlete = {

            restrict: TO += ELEMENTS,
            templateUrl: 'athlete.html',
            scope: {
                athlete: '=',
                rosterId: '=',
                editable: '=?',
                team: '=?',
                positions: '=?',
                toggle: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.keys = window.Object.keys;
                scope.positions = scope.positions || {};
                scope.toggle = scope.toggle;

                scope.updateAthleteInformation = function() {
                    if (scope.athleteForm.$valid) {

                        players.singleSave(scope.rosterId, scope.athlete).then(function(responseAthlete) {
                            angular.extend(scope.athlete, scope.athlete, responseAthlete);
                        });

                    }
                };

                scope.$watch('athlete.rosterStatuses[rosterId]', function() {
                    scope.updateAthleteInformation();
                });

//                scope.$watch('athlete.positionIds[rosterId]', function() {
//                    scope.updateAthleteInformation();
//                });
            }
        };

        return athlete;
    }
]);
