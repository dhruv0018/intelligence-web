var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name PlayManager
 * @type {service}
 */
IntelligenceWebClient.service('PlayManager', [
    '$injector', 'PlaysFactory', 'EventManager',
    function service($injector, plays, eventManager) {

        var playsManager;

        var model = {

            events: []
        };

        this.tagset = null;
        this.gameId = null;
        this.current = null;
        this.playState = null; //current play playing/paused in video?. probably a better place for this, but this is convenient

        /**
         * Clear the current play.
         */
        this.clear = function() {

            this.current = null;
            this.playState = null;
        };

        /**
         * Resets the current play.
         */
        this.reset = function(tagset, gameId) {

            this.tagset = tagset || this.tagset;

            this.gameId = gameId || this.gameId;
            this.current = angular.copy(model);
            this.current.gameId = this.gameId;
        };

        /**
         * Creates a play.
         */
        this.create = function() {

            playsManager = playsManager || $injector.get('PlaysManager');

            this.reset();
            playsManager.addPlay(this.current);
        };

        /**
         * Add an event to the play.
         * @param {Object} event - event to be added.
         */
        this.addEvent = function(event) {

            playsManager = playsManager || $injector.get('PlaysManager');

            /* If there is no current play. */
            if (!this.current) {

                /* Create a play. */
                this.create();
            }

            /* If there are no plays in the playlist. */
            if (!playsManager.plays.length) {

                /* Add the current play to the playlist. */
                playsManager.addPlay(this.current);
            }

            /* Make sure events have a time that is a number, or default to zero. */
            event.time = angular.isNumber(event.time) ? event.time : 0;

            /* If there are no play times set, use the event time. */
            if (!this.current.startTime) this.current.startTime = event.time;
            if (!this.current.endTime) this.current.endTime = event.time;

            /* Adjust the play start and end time if the event is out of the
             * current range. */
            if (event.time < this.current.startTime) this.current.startTime = event.time;
            if (event.time > this.current.endTime) this.current.endTime = event.time;

            /* Lookup tag buffer. */
            var tagId = event.tagId;
            var tag = this.tagset.tags[tagId];
            var buffer = tag.buffer;

            /* Adjust the play times by the tag buffer. */
            if (buffer < 0) this.current.startTime += buffer;
            if (buffer > 0) this.current.endTime += buffer;

            /* Index of the event, based on acceding time order. */
            var index = 0;

            /* Advance index as long as it is still inside the events and
             * the time of the event is after the event at the index. */
            while (index < this.current.events.length &&
                   event.time > this.current.events[index].time) { index++; }

            /* Insert the event into the appropriate index. */
            this.current.events.splice(index, 0, event);
        };

        /**
         * Remove an event from the play.
         * @param {Object} event - event to be removed.
         */
        this.removeEvent = function(event) {

            /* Find the index of the event. */
            var eventIndex = this.current.events.indexOf(event);

            /* Record if event was first or last before removal. */
            var wasFirstEvent = eventIndex === 0;
            var wasLastEvent = eventIndex === this.current.events.length - 1;

            /* Remove current event from the current play. */
            this.current.events.splice(eventIndex, 1);

            /* If there are other events left in the play. */
            if (this.current.events.length) {

                var firstEvent = this.current.events[0];
                var lastEvent = this.current.events[this.current.events.length - 1];
                var previousEvent = this.current.events[eventIndex - 1];

                /* Lookup tag buffer. */
                var tagId = event.tagId;
                var tag = this.tagset.tags[tagId];
                var buffer = tag.buffer;

                /* If the event was the first event in the play. */
                if (wasFirstEvent) {

                    /* Set the play start time to the new first event. */
                    this.current.startTime = firstEvent.time;
                }

                /* If the event was the last event in the play. */
                if (wasLastEvent) {

                    /* Set the play end time to the new last event. */
                    this.current.endTime = lastEvent.time;
                }

                /* Adjust the play times by the tag buffer. */
                if (buffer < 0) this.current.startTime -= buffer;
                if (buffer > 0) this.current.endTime -= buffer;

                /* Set the current event to the previous event. */
                eventManager.current = previousEvent;
            }

            /* If there are no events left in the play. */
            else {

                /* Reset the current event. */
                eventManager.reset();

                /* Remove the current play. */
                this.remove();
            }
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.remove = function(play) {

            playsManager = playsManager || $injector.get('PlaysManager');

            play = play || this.current;

            /* Remove the play from the play list. */
            playsManager.removePlay(play);

            /* If the play has been saved before. */
            if (play.id) {

                /* Also remove it remotely. */
                plays.remove(play);
            }
        };

        /**
         * Saves a play.
         */
        this.save = function(play) {

            playsManager = playsManager || $injector.get('PlaysManager');

            play = play || this.current;

            var playIndex = playsManager.plays.indexOf(play);

            playsManager.plays[playIndex].isSaving = true;

            /* Save the play remotely. */
            plays.save(play).then(function(play) {

                /* If the play exists in the play list. */
                if (~playIndex) {

                    /* Update the play in the play list. */
                    playsManager.plays[playIndex] = play;
                }

            }).finally(function() {

                playsManager.plays[playIndex].isSaving = false;
            });
        };
    }
]);

