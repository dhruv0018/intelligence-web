/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

import GameRosterManager from './game-roster-manager/index.js';
import TeamRosterManager from './team-roster-manager/index.js';

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
            if (!filterType || filterType === 'none') {
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

export default RosterManager;
