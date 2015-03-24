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
                    var playerInfo = mergedRosters[playerId];
                    var player = angular.extend({}, players.get(playerId), playerInfo);
                    player.jerseyNumber = (playerInfo.jerseyNumber.length === 0) ? 'UN' : parseInt(playerInfo.jerseyNumber, 10);
                    player.primaryJerseyColor = game.rosters[game.teamId].playerInfo[playerId] ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor;
                    player.type = 'Player';
                    playerList.push(player);
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
