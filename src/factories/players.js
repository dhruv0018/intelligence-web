var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$q', 'PlayersResource', 'PlayersStorage', 'BaseFactory',
    function($q, PlayersResource, PlansStorage, BaseFactory) {

        var PlayersFactory = {

            description: 'players',

            storage: PlansStorage,

            resource: PlayersResource,

            save: function(rosterId, players) {

                var self = this;

                if (!rosterId) throw new Error('No roster ID');
                if (!players) throw new Error('No players to save');

                var filter = { roster: rosterId };

                var currentPlayers = players.filter(function(player) {

                    return player.id;
                });

                var newPlayers = players.filter(function(player) {

                    return !player.id;
                });

                newPlayers = newPlayers.map(function(player) {

                    player.rosterIds = [rosterId];

                    return player;
                });

                if (newPlayers.length) {

                    newPlayers = self.resource.create(newPlayers).$promise;
                }

                currentPlayers = currentPlayers.map(function(player) {

                    return self.resource.update(player).$promise;
                });

                var allPlayers = currentPlayers.concat(newPlayers);

                return $q.all(allPlayers).then(function() {

                    return self.getList(filter).$promise;
                });
            },

            resendEmail: function(player, team) {
                var self = this;

                return self.resource.resendEmail({
                    userId: player.userId,
                    teamId: team.id
                });
            },
            toggleActivation: function(rosterId) {
                this.rosterStatuses[rosterId] = !this.rosterStatuses[rosterId];
            },
            constructActiveRoster: function(roster, rosterId) {
                return roster.filter(function(player) {
                    return player.rosterStatuses[rosterId] === true;
                });
            },
            constructPositionDropdown: function(roster, rosterId, positions) {
                angular.forEach(roster, function(player) {
                    //constructs position dropdown
                    player.selectedPositions = {};

                    //adds each position checkboxes for each player
                    angular.forEach(positions, function(position) {
                        player.selectedPositions[position.id] = false;
                    });

                    //sets the positions that already exist on the players
                    if (typeof player.positions[rosterId] !== 'undefined' && player.positions[rosterId].length > 0) {
                        angular.forEach(player.positions[rosterId], function(position) {
                            player.selectedPositions[position.id] = true;
                        });
                    }
                });

                return roster;
            },
            getPositionsFromDowndown: function(roster, rosterId, positions) {
                angular.forEach(roster, function(player) {
                    //todo have backend convert this to object always, no reason to be an array
                    if (window.Array.isArray(player.positions)) {
                        player.positions = {};
                    }
                    //ensures that positions are strictly based on those selected via the ui
                    player.positions[rosterId] = [];

                    angular.forEach(player.selectedPositions, function(position, key) {
                        player.positions[rosterId] = player.positions[rosterId] || [];

                        //the position is selected
                        if (position === true) {
                            player.positions[rosterId].push(positions[key]);
                        }
                    });
                });
                return roster;
            }
        };

        angular.extend(PlayersFactory, BaseFactory);

        return PlayersFactory;
    }
]);

