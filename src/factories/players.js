var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$q', 'PlayersResource', 'PlayersStorage', 'BaseFactory',
    function($q, PlayersResource, PlansStorage, BaseFactory) {

        var PlayersFactory = {

            description: 'players',

            storage: PlansStorage,

            resource: PlayersResource,

            singleSave: function(rosterId, player) {
                var self = this;

                player.rosterIds = [rosterId];
                delete player.resource;
                delete player.storage;

                if (player.id) {
                    return self.resource.update(player).$promise;
                } else {
                    return self.resource.singleCreate(player).$promise.then(function(player) {
                        angular.extend(player, self);
                        return player;
                    });
                }

            },

            save: function(rosterId, players) {

                var self = this;

                if (!rosterId) throw new Error('No roster ID');
                if (!players) throw new Error('No players to save');

                var filter = { rosterId: rosterId };

                var currentPlayers = players.filter(function(player) {
                    return player.id;
                }).map(function(player) {
                    delete player.resource;
                    delete player.storage;

                    return player;
                });

                var newPlayers = players.filter(function(player) {

                    return !player.id;
                });

                newPlayers = newPlayers.map(function(player) {
                    delete player.resource;
                    delete player.storage;

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

                    return self.query(filter);
                });
            },
            resendEmail: function(userId, teamId) {
                var self = this;

                return self.resource.resendEmail({
                    userId: userId,
                    teamId: teamId
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
            constructPositionDropdown: function(player, rosterId, positions) {

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

                return player;
            },
            getPositionsFromDowndown: function(player, rosterId, positions) {

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

                return player;
            }
        };

        angular.augment(PlayersFactory, BaseFactory);

        return PlayersFactory;
    }
]);

