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
        this.playScopeList = {
            scopes: {},
            head: void 0,
            tail: void 0
        };
        this.currentPlayIndex = 0;

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

        this.getNextPlay = function getNextPlay(currentPlay) {
            var currentPlayScope = this.playScopeList.scopes[currentPlay.id];
            if (currentPlayScope) return currentPlayScope.nextPlayScope;
        };

        this.registerPlayScope = function registerPlayScope(playScope) {
            //create hash of play scopes indexed by the scopes play's id
            this.playScopeList.scopes[playScope.play.id] = playScope;

            //Build linked list of play scopes
            if (typeof this.playScopeList.head === 'undefined') {
                this.playScopeList.head = playScope;
                this.playScopeList.tail = playScope;
            } else {
                this.playScopeList.tail.nextPlayScope = playScope;
                this.playScopeList.tail = playScope;
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
         * Removes all plays.
         */
        this.removeAllPlays = function() {

            this.plays.forEach(function(play) {

                play.remove();
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

