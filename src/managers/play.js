var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * @module IntelligenceWebClient
 * @name PlayManager
 * @type {service}
 */
IntelligenceWebClient.service('PlayManager', [
    'AlertsService', 'TagsManager', 'PlaysFactory', 'IndexingService',
    function service(alerts, tags, plays, indexing) {

        var model = {

            events: []
        };

        this.gameId = null;

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
        this.reset = function(gameId) {

            this.gameId = gameId || this.gameId;

            this.current = angular.copy(model);

            this.current.gameId = this.gameId;
        };

        /**
         * Creates a play.
         */
        this.create = function() {

            this.reset();
            indexing.plays.push(this.current);
        };

        /**
         * Add an event to the play.
         * @param {Object} event - event to be added.
         */
        this.addEvent = function(event) {

            /* If there is no current play. */
            if (!this.current) {

                /* Create a play. */
                this.create();
            }

            /* If there are no plays in the playlist. */
            if (!indexing.plays.length) {

                /* Add the current play to the playlist. */
                indexing.plays.push(this.current);
            }

            /* Add event to the current plays events. */
            this.current.events.push(event);
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.remove = function(play) {

            var self = this;

            /* If the deleted play is the current play. */
            if (angular.equals(play, self.current)) {

                self.clear();
                tags.reset();
            }

            var playIndex = indexing.plays.indexOf(play);

            /* If the play exists in the play list. */
            if (~playIndex) {

                /* Remove play from play list. */
                indexing.plays.splice(playIndex, 1);
            }

            /* If the play has been saved before. */
            if (play.id) {

                /* Also remove it remotely. */
                plays.remove(play);
            }
        };

        /**
         * Saves a play.
         */
        this.save = function() {

            var play = this.current;
            var playIndex = indexing.plays.indexOf(play);

            /* Save the play remotely. */
            plays.save(play).then(function(play) {

                /* If the play exists in the play list. */
                if (~playIndex) {

                    /* Update the play in the play list. */
                    indexing.plays[playIndex] = play;
                }
            });
        };
    }
]);

