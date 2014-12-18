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

        //Index of scopes assosicated with the plays
        //indexed by 'id' for game breakdown playlist, and
        //by '$$hashkey' for indexing playlist
        this.playScopes = {};

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

        this.registerPlayScope = function registerPlayScope(playScope) {
            //create hash of play scopes indexed by the scopes play's id
            var registeredId;
            if (playScope.play.id) {
                registeredId = playScope.play.id;
            } else {
                //Special case for indexing. Automatically selects play
                //to keep the current play at the top of the playlist
                registeredId = playScope.play.$$hashKey;
                if (typeof playScope.selectPlay === 'function') playScope.selectPlay();
            }
            this.playScopes[registeredId] = playScope;
        };

        /* Retreives the previous play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} previousPlay
         */
        this.getPreviousPlay = function getPreviousPlay(currentPlay) {
            var index = this.plays.indexOf(currentPlay);

            if (--index >= 0) {

                var prevPlay = this.plays[index];
                return (angular.isUndefined(prevPlay.isFiltered) || prevPlay.isFiltered) ? this.playScopes[prevPlay.id] : this.getPreviousPlay(prevPlay);
            } else {
                return null;
            }
        };

        /* Retreives the next play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} nextPlay
         */
        this.getNextPlay = function getNextPlay(currentPlay) {
            var index = this.plays.indexOf(currentPlay);

            if (++index < this.plays.length) {

                var nextPlay = this.plays[index];
                return (angular.isUndefined(nextPlay.isFiltered) || nextPlay.isFiltered) ? this.playScopes[nextPlay.id] : this.getNextPlay(nextPlay);
            } else {
                return null;
            }
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
                eventManager.reset();
            }
        };

        /**
         * Delete all plays.
         */
        this.deleteAllPlays = function() {

            this.plays.forEach(function(play) {

                play.delete();
            });
        };

        /**
         * Saves all plays.
         */
        this.save = function() {

            this.plays.forEach(function(play) {

                play.save();
            });
        };
    }
]);

