var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$q', 'PlayersResource',
    function($q, PlayersResource) {

        var PlayersFactory = {

            resource: PlayersResource,

            extendPlayer: function(player) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "player" object. */
                angular.extend(player, self);

                return player;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(player) {

                    player = self.extendPlayer(player);

                    return success ? success(player) : player;
                };

                error = error || function() {

                    throw new Error('Could not get player');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};

                var callback = function(players) {

                    var indexedPlayers = {};

                    players.forEach(function(player) {

                        player = self.extendPlayer(player);

                        indexedPlayers[player.id] = player;
                    });

                    players = index ? indexedPlayers : players;

                    return success ? success(players) : players;
                };

                error = error || function() {

                    throw new Error('Could not load players list');
                };

                return self.resource.query(filter, callback, error);
            },

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
                    if(window.Array.isArray(player.positions)){
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

        return PlayersFactory;
    }
]);

