/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamRosterManager
 * @module roster-manager
 */
var TeamRosterManager = angular.module('team-roster-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamRosterManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('team-roster-manager.html', require('./template.html'));
    }
]);

/**
 * TeamRosterManager directive.
 * @module TeamRosterManager
 * @name TeamRosterManager
 * @type {Directive}
 */
TeamRosterManager.directive('teamRosterManager', [
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES', 'PlayerRosterEntryFactory',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES, playerRosterEntry) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'team-roster-manager.html',
            scope: {
                team: '=?',
                positions: '=?',
                positionset: '=?',
                validator: '=?',
                roster: '=',
                rosterTemplateUrl: '=?',
                type: '@?',
                save: '=?',
                filtering: '=?',
                sortingType: '=?',
                users: '=?'
            },
            replace: true,
            link: {
                pre: pre,
                post: post
            }
        };

        function pre(scope, element, attributes) {
            scope.playerRosterEntries = [];
            angular.forEach(scope.team.roster.playerInfo, function(rosterEntry) {
                var player = players.get(rosterEntry.id);
                scope.playerRosterEntries.push(playerRosterEntry.create(scope.team.roster.id, rosterEntry, player, scope.team));
            });
        }

        function post(scope, element, attributes) {
            scope.$watch('team', function(team) {
                var newRoster = [];
                angular.forEach(team.roster.playerInfo, function(rosterEntry) {
                    var player = players.get(rosterEntry.id);
                    newRoster.push(playerRosterEntry.create(scope.team.roster.id, rosterEntry, player));
                });
                scope.playerRosterEntries = newRoster;
            }, true);

            scope.uploadFile = function(files) {
                scope.files = files;
                scope.$apply();
            };

            scope.ROLES = ROLES;
            scope.keys = window.Object.keys;
            scope.usersFactory = users;
            scope.playersFactory = players;
            scope.options = {
                scope: scope
            };

            scope.addNewPlayer = function() {
                var player = players.create();
                var options = {
                    scope: scope,
                    targetAthlete: player
                };
                AthleteInfo.open(options);
                scope.roster.push(player);
            };
        }



        return rosterManager;
    }
]);
