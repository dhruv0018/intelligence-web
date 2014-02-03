var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('GamesFactory', [
    'GamesResource',
    function(GamesResource) {

        var GamesFactory = {

            resource: GamesResource,

            extendGame: function(game) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "game" object. */
                angular.extend(game, self);

                return game;
            },

            get: function(gameId, callback) {

                var self = this;

                self.resource.get({ id: gameId }, function(game) {

                    game = self.extendGame(game);

                    return callback(game);
                });
            },

            getList: function(filter, success, error) {

                var self = this;

                filter = filter || {};

                success = success || function(games) {

                    return games.forEach(self.extendGame, self);
                };

                error = error || function() {

                    throw new Error('Could not load games list');
                };

                return self.resource.query(filter, success, error);
            },

            save: function(game, success, error) {

                var self = this;

                game = game || self;

                parameters = {};

                success = success || function(game) {

                    return self.extendGame(game);
                };

                error = error || function() {

                    throw new Error('Could not save game');
                };

                if (game.id) {

                    var updatedGame = self.resource.update(parameters, game, success, error);
                    return updatedGame.$promise;

                } else {

                    var newGame = self.resource.create(parameters, game, success, error);
                    return newGame.$promise;
                }
            },

            getRoster: function(teamId) {

                var self = this;

                /* Find any rosters with matching teamIds. */
                var rosters = self.rosters.filter(function(roster) {

                    return roster.teamId == teamId; /* FIXME: teamId in roster might be integer or string */

                });

                /* Pop just one roster. */
                var roster = rosters.pop();

                return roster;
            }
        };

        return GamesFactory;
    }
]);
