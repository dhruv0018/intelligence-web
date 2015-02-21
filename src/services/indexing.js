var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('IndexingService', [
    'config', 'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'VideoPlayer',
    function(config, tagsManager, playsManager, playManager, eventManager, videoPlayer) {

        var IndexingService = {

            reset: function(tagset, game, plays) {

                var self = this;

                game.currentPeriod = 0;
                game.teamIndexedScore = 0;
                game.opposingIndexedScore = 0;

                playsManager.reset(plays);
                tagsManager.reset(tagset);
                eventManager.reset(tagset);
                playManager.reset(tagset, game.id);
                playManager.clear();
            },

            /**
            * Indexes an event.
            */
            index: function() {

                if (this.isIndexing) {

                    if (this.savable()) this.save();
                    else if (this.nextable()) this.next();
                    else this.step();
                }

                else if (videoPlayer.isReady) {

                    this.isIndexing = true;
                    this.showTags = true;
                    this.showScript = false;
                    this.eventSelected = false;
                    videoPlayer.pause();
                }
            },

            /**
            * Selects a tag.
            * @param {Number} tagId - the ID of the tag selected.
            */
            selectTag: function(tagId) {

                /* Get current time from the video. */
                var time = videoPlayer.currentTime;

                /* Create new event. */
                eventManager.create(tagId, time);

                this.showTags = false;
                this.showScript = true;
            },

            /**
            * Steps the current variable.
            */
            step: function() {

                if (!this.isIndexing) return;

                /* Move to the next event variable. */
                eventManager.current.activeEventVariableIndex++;

                /* If the variable is filled in with an optional value. */
                if (eventManager.activeEventVariableValue() === null) {

                    /* Clear the variable value. */
                    eventManager.clearActiveEventVariableValue();
                }
            },

            /**
            * Determines if the current this session is savable.
            * @returns {Boolean} true if the session is savable; false otherwise.
            */
            savable: function() {

                return this.nextable() && eventManager.isEndEvent();
            },

            /**
            * Saves the current play.
            */
            save: function() {

                /* Record the current event. */
                var event = eventManager.current;

                /* Snap video back to time of current event. */
                videoPlayer.seekTime(event.time);

                playManager.save();
                playManager.clear();
                tagsManager.reset();
                eventManager.reset();

                /* If the event is an end-and-start event. */
                if (eventManager.isEndAndStartEvent(event)) {

                    /* Get the tagId of the event. */
                    var tagId = event.tagId;

                    /* Get the tag of the event. */
                    var tag = tagsManager.tagset.tags[tagId];

                    /* Get the child tag ID of the tag. */
                    var childId = tag.children[0];

                    /* Get the next set of tags based on the child tag. */
                    tagsManager.nextTags(childId);

                    /* Set the current event. */
                    eventManager.current = event;

                    /* Set the tag ID for the current event to the child ID. */
                    eventManager.current.tagId = childId;

                    /* Add event to the current play. */
                    playManager.addEvent(eventManager.current);
                }

                this.showTags = false;
                this.showScript = false;
                this.isIndexing = false;
                this.eventSelected = false;

                videoPlayer.play();
            },

            /**
            * Determines if the current this session can be advanced.
            * @returns {Boolean} true if the session can be advanced; false otherwise.
            */
            nextable: function() {

                /* If not this or the tags are showing. */
                if (!this.isIndexing || this.showTags) return false;

                /* If there are variables in the current event. */
                else if (eventManager.hasVariables()) {

                    /* Make sure all of the variables have values. */
                    return eventManager.allEventVariablesHaveValues();
                }

                else return true;
            },

            /**
            * Advances to next set of tags.
            */
            next: function() {

                var tagId;

                this.showTags = false;
                this.showScript = false;
                this.isIndexing = false;
                this.eventSelected = false;

                /* If the event is a floating event. */
                if (eventManager.isFloatingEvent()) {

                    /* Get the previous event. */
                    var previousEvent = eventManager.previousEvent();

                    /* While the previous event is a float. */
                    while (eventManager.isFloatingEvent(previousEvent)) {

                        /* Get the previous event. */
                        previousEvent = eventManager.previousEvent(previousEvent);
                    }

                    /* Get the tagId of the previous event. */
                    tagId = previousEvent.tagId;
                }

                /* Otherwise; if the event is a normal event. */
                else {

                    /* Get the tagId of the current event. */
                    tagId = eventManager.current.tagId;
                }

                /* Get the next set of tags. */
                tagsManager.nextTags(tagId);

                /* Snap video back to time of current event. */
                videoPlayer.seekTime(eventManager.current.time);
                videoPlayer.play();
            },

            /**
            * Moves backwards through previously indexed events and plays.
            */
            back: function() {

                if (!this.isIndexing) return;

                /* If editing an event. */
                if (this.eventSelected) {

                    this.eventSelected = false;
                    this.showTags = true;
                    this.showScript = false;
                    this.isIndexing = true;
                    videoPlayer.play();
                }

                /* If the tags are showing. */
                else if (this.showTags) {

                    /* Drop back into not this state. */
                    this.showTags = false;
                    this.showScript = false;
                    this.isIndexing = false;
                    videoPlayer.play();
                }

                /* If the event doesn't have variables of If the first variable is empty. */
                else if (!eventManager.hasVariables() ||
                        (eventManager.current.activeEventVariableIndex === 1 &&
                        !eventManager.activeEventVariableValue())) {

                    /* Remove the event from the play. */
                    playManager.removeEvent(eventManager.current);

                    /* Drop back to tagging state. */
                    this.showTags = true;
                    this.showScript = false;
                }

                /* If the active variable is empty. */
                else if (!eventManager.activeEventVariableValue()) {

                    /* While the active variable is empty. */
                    while (eventManager.current.activeEventVariableIndex > 1 &&
                          !eventManager.activeEventVariableValue()) {

                        /* Move back one variable. */
                        eventManager.current.activeEventVariableIndex--;
                    }

                    /* Clear the value of the first variable is not empty. */
                    eventManager.clearActiveEventVariableValue();
                }

                /* If the active variable has a value. */
                else if (eventManager.activeEventVariableValue()) {

                    /* Clear the active variables value. */
                    eventManager.clearActiveEventVariableValue();
                }
            },

            /**
            * Deletes an event.
            * @param {Object} selectedEvent - the event to delete.
            */
            deleteEvent: function(selectedEvent) {

                this.showTags = true;
                this.showScript = false;
                this.eventSelected = false;
                this.isIndexing = false;

                /* Delete the selected event. */
                eventManager.delete(selectedEvent);

                /* Save play. */
                playManager.save();

                /* Clear the current play. */
                playManager.clear();
            },

            playPause: function() {

                videoPlayer.playPause();
            },

            jumpBack: function() {

                var currentTime = videoPlayer.currentTime;
                var time = currentTime - config.indexing.video.jump;
                videoPlayer.seekTime(time);
            },

            jumpForward: function() {

                var currentTime = videoPlayer.currentTime;
                var time = currentTime + config.indexing.video.jump;
                videoPlayer.seekTime(time);
            }
        };

        return IndexingService;
    }
]);
