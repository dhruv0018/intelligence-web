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
                    tags.reset();
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

        /**
         * Saves a play.
         */
        this.save = function() {

            var play = this.current;
            var playIndex = indexing.plays.indexOf(play);

            plays.save(play).then(function(play) {

                indexing.plays[playIndex] = play;
            });
        };
    }
]);

