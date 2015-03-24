var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name PlayerListManager
 * @type {service}
 */
IntelligenceWebClient.service('PlayerlistManager', [
    'PlayersFactory',
    function PlayerlistManager(players) {
        var playerList = [];
        return {
            fill: function(game) {
                var mergedRosters = angular.extend({},
                    game.rosters[game.teamId].playerInfo,
                    game.rosters[game.opposingTeamId].playerInfo);

                Object.keys(mergedRosters).forEach(function(playerId) {
                    var player = players.get(playerId);
                    var playerInfo = mergedRosters[playerId];
                    playerInfo.playerId = parseInt(playerId);
                    playerInfo.jerseyNumber = (playerInfo.jerseyNumber.length === 0) ? 'UN' : parseInt(playerInfo.jerseyNumber, 10);
                    playerInfo.primaryJerseyColor = game.rosters[game.teamId].playerInfo[playerId] ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor;
                    playerInfo.firstName = player.firstName;
                    playerInfo.lastName = player.lastName;
                    playerInfo.type = 'Player';
                    playerList.push(playerInfo);
                });
            },
            get: function() {
                return playerList;
            },
            clear: function() {
                playerList = [];
            }
        };
    }
]);
