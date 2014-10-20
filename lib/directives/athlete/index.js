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
                id: '@',
                game: '=',
                positionset: '=',
                positions: '=?',
                toggle: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.toggle = scope.toggle;

                scope.updateAthleteInformation = function() {
                    if (scope.athleteForm.$valid && scope.editable) {

                        players.singleSave(scope.rosterId, scope.athlete).then(function(responseAthlete) {
                            angular.extend(scope.athlete, scope.athlete, responseAthlete);
                            scope.game.save();
                        });

                    }
                };

                scope.$watch('game.rosters[team.id].playerInfo[athlete.id].isActive', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });

                scope.$watch('game.rosters[team.id].playerInfo[athlete.id].positionIds', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });
            }
        };

        return athlete;
    }
]);
