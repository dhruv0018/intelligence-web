var IntelligenceWebClient = require('../app');

/**
 * @module IntelligenceWebClient
 * @name PlayManager
 * @type {service}
 */
IntelligenceWebClient.service('PlayManager', [
    '$modal', 'AlertsService', 'PlaysFactory', 'IndexingService', 'Indexing.TagsService',
    function service($modal, alerts, plays, indexing, tags) {

        var model = {

            gameId: indexing.game.id,
            score: {},
            events: []
        };

        this.current = null;

        /**
         * Clear the current play.
         */
        this.clear = function() {

            this.current = null;
        };

        /**
         * Resets the current play.
         */
        this.reset = function() {

            this.current = angular.copy(model);
        };

        /**
         * Creates a play.
         */
        this.create = function() {

            indexing.plays.push(this.current);
        };

        /**
         * Saves a play.
         */
        this.save = function() {

            var play = this.current;
            var playIndex = indexing.plays.indexOf(play);

            plays.save(play).then(

                function success(play) {

                    indexing.plays[playIndex] = play;
                    indexing.plays[playIndex].score = indexing.calculateScore(play.id);
                },

                function error() {

                    alerts.add({

                        type: 'danger',
                        message: 'Failed to save play'
                    });
                }
            );
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.remove = function(play) {

            var self = this;

            var removePlay = function(play) {

                var playIndex = indexing.plays.indexOf(play);

                /* Remove play from plays list. */
                indexing.plays.splice(playIndex, 1);

                /* If the deleted play is the current play. */
                if (angular.equals(play, self.current)) {

                    self.clear();
                }
            };

            var removePlayError = function() {

                alerts.add({

                    type: 'danger',
                    message: 'Failed to delete play'
                });
            };

            /* If the play has been saved before, also remove it remotely. */
            if (play.id) plays.remove(play).then(removePlay(play), removePlayError);

            /* If not, then just remove it locally. */
            else removePlay(play);
        };
    }
]);

