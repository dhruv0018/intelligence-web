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
                scope.ROLES = ROLES;
                scope.keys = window.Object.keys;
                scope.usersFactory = users;
                scope.playersFactory = players;
                scope.players = players.getCollection();
                scope.options = {
                    scope: scope
                };

                scope.$watch('formTeamActive.$invalid', function(invalid) {

                    if (invalid) {
                        scope.validator = false;
                    } else {
                        scope.validator = true;
                    }

                });

                scope.addNewPlayer = function() {
                    var player = players.create();

                    if (scope.type === 'interface') {

                        var options = {
                            scope: scope,
                            targetAthlete: player
                        };

                        AthleteInfo.open(options);

                    }

                    scope.roster.push(player);
                };

//                scope.toggleActivation = function(player) {
//                    if (player && player.id) {
//                        player.toggleActivation(scope.team);
//                        if (!scope.team.isCustomerTeam) {
//                            scope.roster.splice(scope.roster.indexOf(player), 1);
//                        }
//                    }
//
//                    else {
//                        scope.roster.splice(scope.roster.indexOf(player), 1);
//                    }
//                };


                scope.uploadFile = function(files) {
                    scope.files = files;
                    scope.$apply();
                };
            }

        };



        return rosterManager;
    }
]);

RosterManager.filter('activeStatus', [
    function() {
        return function(rosterEntries, filterType) {
            var filteredRosterEntries = [];
            angular.forEach(rosterEntries, function(rosterEntry) {
                if (filterType === 'active') {
                    if (rosterEntry.isActive) {
                        filteredRosterEntries.push(rosterEntry);
                    }
                }
                if (filterType === 'inactive') {
                    if (!rosterEntry.isActive) {
                        filteredRosterEntries.push(rosterEntry);
                    }
                }
            });
            return filteredRosterEntries;
        };
    }
]);
