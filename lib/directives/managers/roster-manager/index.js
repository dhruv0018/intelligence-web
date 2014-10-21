/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;


require('game-roster-manager');
require('team-roster-manager');

/**
 * RosterManager
 * @module roster-manager
 */
var RosterManager = angular.module('roster-manager', [
    'ui.router',
    'ui.bootstrap',
    'game-roster-manager',
    'team-roster-manager'
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
            replace: true,
            link: function(scope, element, attributes) {
            }

        };



        return rosterManager;
    }
]);

RosterManager.filter('activeStatus', [
    function() {
        return function(playerRosterEntries, filterType) {
            var filteredRosterEntries = [];
            angular.forEach(playerRosterEntries, function(playerRosterEntry) {
                if (playerRosterEntry.rosterEntry) {
                    if (filterType === 'active') {
                        if (playerRosterEntry.playerInfo.isActive) {
                            filteredRosterEntries.push(playerRosterEntry);
                        }
                    }
                    if (filterType === 'inactive') {
                        if (!playerRosterEntry.playerInfo.isActive) {
                            filteredRosterEntries.push(playerRosterEntry);
                        }
                    }
                }
            });
            return filteredRosterEntries;
        };
    }
]);

RosterManager.factory('PlayerRosterEntryFactory', ['GamesFactory', 'TeamsFactory', function() {
    return {
        create: function(rosterId, playerInfo, player, parentResource) {
            var playerRosterEntry =  {
                parentResource: parentResource,
                playerInfo: playerInfo,
                player: player,
                rosterId: rosterId
            };

            //angular.extend(this, playerRosterEntry);
            angular.extend(playerRosterEntry, this);

            return playerRosterEntry;
        },
        save: function() {
            var self = this;
        }
    };
}]);
