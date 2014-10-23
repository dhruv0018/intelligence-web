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
                roster: '=',
                editable: '=?',
                team: '=?',
                game: '=',
                positionset: '=',
                positions: '=?',
                toggle: '=?',
                rosterEntry: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.toggle = scope.toggle;

                scope.updateAthleteInformation = function() {
                    if (scope.athleteForm.$valid && scope.editable && !scope.athlete.isSaving) {
                        scope.athlete.isSaving = true;
                        players.singleSave(scope.roster.id, scope.athlete).then(function(responseAthlete) {
                            if (!scope.athlete.id) {
                                angular.extend(scope.athlete, scope.athlete, responseAthlete);
                            }
                            scope.game.rosters[scope.team.id].playerInfo = scope.game.rosters[scope.team.id].playerInfo || {};
                            scope.game.rosters[scope.team.id].playerInfo[responseAthlete.id] = scope.rosterEntry.playerInfo;

                            scope.game.save().then(function() {
                                scope.athlete.isSaving = false;
                            });

                            //syncing back the game roster to the team
                            if (!scope.team.isCustomerTeam) {
                                scope.team.roster.playerInfo = scope.game.rosters[scope.team.id].playerInfo;
                                scope.team.save();
                            }
                        });
                    }
                };

                scope.$watch('rosterEntry.playerInfo.isActive', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });

                scope.$watch('rosterEntry.playerInfo.positionIds', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });
            }
        };

        return athlete;
    }
]);
