/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RosterManager
 * @module roster-manager
 */
var RosterManager = angular.module('roster-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RosterManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('roster-manager.html', require('./template.html'));
    }
]);

/**
 * RosterManager directive.
 * @module RosterManager
 * @name RosterManager
 * @type {Directive}
 */
RosterManager.directive('krossoverRosterManager', [
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'roster-manager.html',
            scope: {
                rosterId: '=?',
                roster: '=?',
                team: '=?',
                positions: '=?',
                positionset: '=?',
                validator: '=?',
                rosterTemplateUrl: '=?',
                type: '@?',
                save: '=?',
                filtering: '=?',
                sortingType: '=?',
                users: '=?',
                game: '=?',
                editable: '='
            },
            replace: true,
            link: function(scope, element, attributes) {
                console.log(scope.game.rosters[scope.team.id].playerInfo);
                console.log(scope);
                scope.ROLES = ROLES;
                scope.keys = window.Object.keys;
                scope.usersFactory = users;
                scope.playersFactory = players;
                scope.options = {
                    scope: scope
                };
                scope.$watch('filtering', function(filtering) {
                    if (typeof filtering !== 'undefined') {

                        if (filtering === 'inactive') {
                            scope.filterType = scope.isInactive;
                        } else if (filtering === 'active') {
                            scope.filterType = scope.isActive;
                        } else if (filtering === 'none') {
                            scope.filterType = {};
                        }
                    }
                });


                scope.$watch('formTeamActive.$invalid', function(invalid) {

                    if (invalid) {
                        scope.validator = false;
                    } else {
                        scope.validator = true;
                    }

                });

                scope.isActive = function(rosterEntry) {
                    return rosterEntry.isActive;
                };

                scope.isInactive = function(rosterEntry) {
                    return !rosterEntry.isActive;
                };

                scope.addNewPlayer = function() {
                    var player = {
                        jerseyNumbers: {},
                        rosterStatuses: {},
                        positionIds: {},
                        isUnknown: false
                    };

                    player.positionIds[scope.rosterId] = [];

                    player.rosterStatuses[scope.rosterId] = true;

                    if (scope.type === 'interface') {

                        var options = {
                            scope: scope,
                            targetAthlete: player
                        };

                        AthleteInfo.open(options);

                    }

                    scope.roster.push(player);
                };

                scope.toggleActivation = function(player) {
                    if (player && player.id) {
                        player.toggleActivation(scope.rosterId);
                        if (!scope.team.isCustomerTeam) {
                            scope.roster.splice(scope.roster.indexOf(player), 1);
                            player.singleSave(scope.rosterId, player);
                        }
                    }

                    else {

                        scope.roster.splice(scope.roster.indexOf(player), 1);
                    }
                };


                scope.uploadFile = function(files) {
                    scope.files = files;
                    scope.$apply();
                };
            }

        };

        return rosterManager;
    }
]);
