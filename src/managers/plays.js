import KrossoverEvent from '../entities/event.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name PlaysManager
 * @type {service}
 */
IntelligenceWebClient.service('PlaysManager', [
    '$injector', 'AlertsService', 'TagsManager', 'PlayManager', 'EventManager', 'PlaysFactory',
    function service($injector, alerts, tagsManager, playManager, eventManager, plays) {

        var indexing;

        this.plays = [];

        /**
         * Resets the plays.
         * @param {Array} plays - array to set the plays to.
         */
        this.reset = function(plays) {

            plays = plays || [];

            this.plays = plays;
        };

        /**
         * Gets the last play.
         */
        this.getLastPlay = function() {

            return this.plays[this.plays.length - 1];
        };

        /* Returns the index of a play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Number} index
         */
        this.getIndex = function(currentPlay) {
            return this.plays.indexOf(currentPlay);
        };

        /* Retrieves the previous play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} previousPlay
         */
        this.getPreviousPlay = function(currentPlay) {
            var index = this.plays.indexOf(currentPlay);
            return (--index >= 0) ? this.plays[index] : null;
        };

        /* Retrieves the next play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} nextPlay
         */
        this.getNextPlay = function(currentPlay) {
            var index = this.plays.indexOf(currentPlay);
            return (++index < this.plays.length) ? this.plays[index] : null;
        };

        /**
         * Adds a play.
         * @param {Object} play - play to be added.
         */
        this.addPlay = function(play) {

            this.plays.push(play);
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.removePlay = function(play) {

            var playIndex = this.plays.indexOf(play);

            /* If the play exists in the play list. */
            if (~playIndex) {

                /* Remove play from play list. */
                this.plays.splice(playIndex, 1);
            }

            /* If the deleted play is the current play. */
            if (angular.equals(play, playManager.current)) {

                indexing = indexing || $injector.get('IndexingService');

                indexing.showTags = false;
                indexing.showScript = false;
                indexing.isIndexing = false;
                indexing.eventSelected = false;

                playManager.clear();
                tagsManager.reset();
                eventManager.current = new KrossoverEvent();
            }
        };
    }
]);
