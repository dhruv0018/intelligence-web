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
            if (!filterType) {
                return playerRosterEntries;
            }
            var filteredRosterEntries = [];
            angular.forEach(playerRosterEntries, function(playerRosterEntry) {
                if (playerRosterEntry.playerInfo) {
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

    function PlayerRosterEntry(rosterId, playerInfo, player, parentResource) {
        this.parentResource = parentResource;
        this.playerInfo = playerInfo;
        this.player = player;
        this.rosterId = rosterId;
    }

    return {
        create: function(rosterId, playerInfo, player, parentResource) {
            var resource = new PlayerRosterEntry(rosterId, playerInfo, player, parentResource);
            angular.extend(resource, this);
            return resource;
        }
    };
}]);

RosterManager.filter('isUnknown', function() {
    return function(playerRosterEntries) {
        var filteredRosterEntries = [];
        angular.forEach(playerRosterEntries, function(playerRosterEntry) {
            if (playerRosterEntry.player) {
                if (!playerRosterEntry.player.isUnknown) {
                    filteredRosterEntries.push(playerRosterEntries);
                }
            }
        });
        return filteredRosterEntries;
    };
});
