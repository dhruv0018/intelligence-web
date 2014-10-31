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
    'PlayersFactory', '$timeout',
    function directive(players, $timeout) {

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
                rosterEntry: '=?',
                playerEntries: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                //used for debouncing until angular 1.3
                var timeout;
                var debouncingTimeMS = 3000;

                scope.updateAthleteInformation = function() {
                    if (scope.athleteForm.$valid && scope.editable && !scope.athlete.isSaving && scope.game.allowEdits && !athlete.isUnknown) {
                        scope.athlete.isSaving = true;

                        timeout = $timeout(function() {
                            scope.athlete.save().then(function(responseAthlete) {
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
                        }, debouncingTimeMS);
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

                scope.toggle = function(rosterEntry) {
                    if (rosterEntry.playerInfo) {
                        rosterEntry.playerInfo.isActive = false;
                        if (rosterEntry.player && rosterEntry.player.id) {
                            scope.game.rosters[scope.team.id].playerInfo[rosterEntry.player.id].isActive = false;
                            scope.team.roster.playerInfo[rosterEntry.player.id].isActive = false;
                            scope.game.save();
                            scope.team.save();
                        }
                    }
                    if (!scope.team.isCustomerTeam) {
                        scope.playerEntries.splice(scope.playerEntries.indexOf(rosterEntry), 1);
                    }
                };
            }
        };

        return athlete;
    }
]);
