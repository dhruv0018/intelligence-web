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

            save: function(game) {

                var self = this;

                game = game || self;

                if (game.id) return game.$update();

                else {

                    var newGame = new GamesResource(game);
                    return newGame.$create();
                }
            }
        };

        return GamesFactory;
    }
]);

