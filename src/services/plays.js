var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlaysFactory', [
    'PlaysResource',
    function(PlaysResource) {

        var PlaysFactory = {

            resource: PlaysResource,

            extendPlay: function(play) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "play" object. */
                angular.extend(play, self);

                return play;
            },

            getList: function(gameId, success, error, index) {

                var self = this;

                var callback = function(plays) {

                    var indexedPlays = {};
                    
                    plays.forEach(function(play) {

                        play = self.extendPlay(play);

                        indexedPlays[play.id] = play;
                    });

                    plays = index ? indexedPlays : plays;

                    return success ? success(plays) : plays;
                };

                error = error || function() {

                    throw new Error('Could not load plays list');
                };

                return self.resource.query({gameId: gameId}, callback, error);
            },

            save: function(play) {

                var self = this;

                play = play || self;

                delete play.teams;

                if (play.id) {

                    var updatePlay = new PlaysResource(play);
                    return updatePlay.$update();

                } else {

                    var newPlay = new PlaysResource(play);
                    return newPlay.$create();
                }
            }
        };

        return PlaysFactory;
    }
]);
