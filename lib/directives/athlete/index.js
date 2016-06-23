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
    '$timeout',
    'PlayersFactory',
    'UsersFactory',
    'SessionService',
    function directive(
        $timeout,
        players,
        users,
        session
    ) {

        var athlete = {

            restrict: TO += ELEMENTS,
            templateUrl: 'athlete.html',
            scope: {
                athlete: '=',
                rosterState: '=',
                roster: '=',
                editable: '=?',
                team: '=?',
                game: '=',
                positionset: '=',
                positions: '=?',
                rosterEntry: '=?',
                playerEntries: '=?',
                idHook: '@?',
                users: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.users = users.getMap();
                scope.isUserTeam = (scope.team && scope.team.id) ? session.currentUser.currentRole.teamId === scope.team.id : false;
                scope.isHomeTeam = (scope.game && (scope.team.id === scope.game.teamId)) ? true : false;
                scope.isOpponentTeam = (scope.game && (scope.team.id === scope.game.opposingTeamId)) ? true : false;

                scope.canAdd = function(){
                    if(!scope.team.isCustomerTeam || !scope.isHomeTeam){
                        //only allow to edit name for user that is not from team roster
                        if(scope.rosterEntry.isCustom){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return false;
                    }
                };
                //used for debouncing until angular 1.3
                var timeout;
                var debouncingTimeMS = 200;

                scope.$watch('rosterEntry', function(newV){
                    if(scope.rosterEntry && scope.rosterEntry.player){
                        scope.athlete = scope.rosterEntry.player;
                    }
                });

                scope.updateAthleteInformation = function() {
                    if (scope.editable &&
                        scope.athlete.save &&
                        !scope.athlete.isSaving &&
                        scope.game.allowEdits &&
                        !athlete.isUnknown &&
                        scope.rosterEntry.playerInfo.jerseyNumber.length &&
                        scope.rosterEntry.playerInfo.jerseyNumber.length > 0) {
                        scope.athlete.isSaving = true;
                        scope.rosterState.isSaving = true;

                        timeout = $timeout(function() {
                            scope.athlete.save().then(function(responseAthlete) {
                                scope.game.rosters[scope.team.id].playerInfo = scope.game.rosters[scope.team.id].playerInfo || {};
                                scope.game.rosters[scope.team.id].playerInfo[responseAthlete.id] = scope.rosterEntry.playerInfo;

                                scope.game.save().finally(function() {
                                    scope.athlete.isSaving = false;
                                    scope.rosterState.isSaving = false;
                                });
                            });
                        }, debouncingTimeMS);
                    }
                };

                //saves customer players if the did not play is checked/unchecked
                scope.$watch('rosterEntry.playerInfo.isActive', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });

                scope.$watchCollection('rosterEntry.playerInfo.positionIds', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.updateAthleteInformation();
                    }
                });

                //action only available for non-customer teams
                //this is what occurs when you remove a player from a non customer team
                scope.toggle = function(rosterEntry) {
                    if (rosterEntry.playerInfo) {
                        rosterEntry.playerInfo.isActive = false;
                        if (rosterEntry.player && rosterEntry.player.id) {
                            scope.game.rosters[scope.team.id].playerInfo[rosterEntry.player.id].isActive = false;
                            scope.game.save();
                        }
                    }
                    scope.playerEntries.splice(scope.playerEntries.indexOf(rosterEntry), 1);
                };
            }
        };

        return athlete;
    }
]);
