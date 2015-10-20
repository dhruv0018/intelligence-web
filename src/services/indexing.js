import KrossoverEvent from '../entities/event/index';
import Stack from '../collections/stack.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('IndexingService', [
    'PlaysFactory', 'EVENT', 'config', 'TagsetsFactory', 'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'VideoPlayer', 'PlaylistEventEmitter', 'Utilities',
    function(plays, EVENT, config, tagsets, tagsManager, playsManager, playManager, eventManager, videoPlayer, playlistEventEmitter, utils) {

        /*Stack used to keep track of tags when clicking the back command*/

        var IndexingService = {

            reset: function(tagset, game, plays) {

                this.showTags = false;
                this.showScript = false;
                this.isIndexing = false;
                this.eventSelected = false;
                this.tagStack = new Stack();

                game.currentPeriod = 0;
                game.indexedScore = 0;
                game.opposingIndexedScore = 0;

                eventManager.current = null;
                playsManager.reset(plays);
                tagsManager.reset(tagset);
                playManager.reset(tagset, game.id);
                playManager.clear();
                playsManager.calculatePlays();
            },

            /**
            * Indexes an event.
            */
            index: function() {

                if (this.isIndexing) {

                    if (this.savable()) this.save();
                    else if (this.nextable()) this.next();
                }

                else if (videoPlayer.isReady) {

                    this.isIndexing = true;
                    this.showTags = true;
                    this.showScript = false;
                    this.eventSelected = false;
                    videoPlayer.pause();
                    this.indexingStartedTime = videoPlayer.currentTime;
                }
            },

            /**
            * Selects a tag.
            * @param {Number} tagId - the ID of the tag selected.
            */
            selectTag: function(tagId, game) {
                if (!tagId) {
                    throw new Error('No tagId specified');
                }

                if (!game && game.id) {
                    throw new Error('No game specified');
                }

                /* Get current time from the video. */
                let time = this.indexingStartedTime;

                /* Get tag. */
                let tag = tagsets.getTag(tagId);

                /* get browser safe time */
                time = utils.toFixedFloat(time);

                /* Create new event. */
                eventManager.current = new KrossoverEvent(null, tag, time, game.id);

                if (!tag.isGroup) {

                    /* Add event to the current play. */
                    playManager.addEvent(eventManager.current);
                }

                /*Push onto the stack the new set of tags*/
                let indexingTags = tagsManager.current;
                this.tagStack.clear();
                this.tagStack.push({ tags:indexingTags });

                if(tag.isGroup) {
                    this.next();
                    this.isIndexing = true;
                    this.showTags = true;
                    this.showScript = false;
                    videoPlayer.pause();
                } else {
                    this.showTags = false;
                    this.showScript = true;
                }
            },

            /**
            * Determines if the current this session is savable.
            * @returns {Boolean} true if the session is savable; false otherwise.
            */
            savable: function() {

                return this.nextable() && eventManager.current && eventManager.current.isEnd;
            },

            /**
            * Saves the current play.
            */
            save: function() {

                /* Record the current event. */
                var event = eventManager.current;

                /* Snap video back to time of current event. */
                videoPlayer.seekTime(event.time);

                playManager.current.save();

                playsManager.calculatePlays();
                playManager.clear();
                tagsManager.reset();
                eventManager.current = null;

                /* If the event is an end-and-start event. */
                if (event.isEndAndStart) {

                    /* Get the game ID. */
                    let gameId = playManager.gameId;

                    /* Get the tagId of the event. */
                    var tagId = event.tagId;

                    /* Get the tag of the event. */
                    var tag = tagsManager.tagset.tags[tagId];

                    /* Get the child tag ID of the tag. */
                    var childId = tag.children[0];

                    /* Get the next set of tags based on the child tag. */
                    tagsManager.nextTags(childId);

                    /* Get corresponding start tag. */
                    let startTag = tagsets.getTag(childId);

                    /* Set the current event. */
                    eventManager.current = new KrossoverEvent(
                        event.toJSON(),
                        startTag,
                        event.time,
                        gameId
                    );

                    if (!tag.isGroup) {

                        /* Add event to the current play. */
                        playManager.addEvent(eventManager.current);
                    }

                    /*Push onto the stack the new set of tags*/
                    let indexingTags = tagsManager.current;
                    this.tagStack.clear();
                    this.tagStack.push({ tags:indexingTags });
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
                if (!this.isIndexing || this.showTags) {

                    return false;
                }
                /* If there are variables in the current event. */
                else {
                    return eventManager.current.isValid;
                }

            },

            /**
            * Clears any previous sets of tags stored while traversing
            * group tags. Prevents any backwared traversal until new
            * tags are selected
            */
            clearTags: function() {

                this.tagStack.clear();
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
                if (eventManager.current && eventManager.current.isFloat) {

                    let currentEvent = eventManager.current;

                    /* Get the previous event. */
                    let previousEvent = playManager.previousEvent(currentEvent);

                    /* While the previous event is a float. */
                    while (previousEvent.isFloat) {

                        /* Get the previous event. */
                        previousEvent = playManager.previousEvent(previousEvent);
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

                    if(!this.tagStack.isEmpty()) {

                        /* If tag stack is not empty, pop the last set of tags
                        and replace the current set of tags with the popped tags */
                        let indexingTags = this.tagStack.pop();
                        tagsManager.current = indexingTags.tags;
                    } else {

                        this.showTags = false;
                        this.showScript = false;
                        this.isIndexing = false;
                        this.tagStack.clear();
                        videoPlayer.play();
                    }
                }

                else if (this.showScript) {

                    /* Remove the event from the play. */
                    playManager.removeEvent(eventManager.current);

                    /* Drop back to tagging state. */
                    this.showTags = true;
                    this.showScript = false;
                }
            },

            /**
            * Deletes an event.
            * @param {Object} event - the event to delete.
            */
            deleteEvent: function(event) {

                this.showTags = true;
                this.showScript = false;
                this.eventSelected = false;
                this.isIndexing = false;

                /* Remove the event from the current play. */
                playManager.removeEvent(event);
            },

            onEventSelect: function (event) {

                this.eventSelected = true;
                this.isIndexing = true;
                this.showTags = false;
                this.showScript = true;
                /* Snap video back to time of current event. */
                videoPlayer.seekTime(event.time);
            }
        };

        return IndexingService;
    }
]);
