var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('IndexingService', [
    'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'VideoPlayerInstance',
    function(tagsManager, playsManager, playManager, eventManager, Videoplayer) {

        var videoplayer;

        var IndexingService = {

            reset: function(tagset, game, plays) {

                var self = this;

                self.isReady = false;

                game.teamIndexedScore = 0;
                game.opposingIndexedScore = 0;

                playsManager.reset(plays);
                tagsManager.reset(tagset);
                eventManager.reset(tagset);
                playManager.reset(tagset, game.id);
                playManager.clear();

                Videoplayer.then(function(player) {

                    videoplayer = player;
                    self.isReady = true;
                });
            },

            /**
            * Indexes an event.
            */
            index: function() {

                this.isIndexing = true;
                this.showTags = true;
                this.showScript = false;
                this.eventSelected = false;
                videoplayer.pause();
            },

            /**
            * Selects a tag.
            * @param {Number} tagId - the ID of the tag selected.
            */
            selectTag: function(tagId) {

                /* Get current time from the video. */
                var time = videoplayer.getCurrentTime();

                /* Create new event. */
                eventManager.create(tagId, time);

                this.showTags = false;
                this.showScript = true;
            },

            /**
            * Steps the current variable.
            */
            step: function() {

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

                this.showTags = false;
                this.showScript = false;
                this.isIndexing = false;
                this.eventSelected = false;

                /* Snap video back to time of current event. */
                videoplayer.seekTime(eventManager.current.time);
                videoplayer.play();

                playManager.save();
                playManager.clear();
                tagsManager.reset();
                eventManager.reset();
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

                this.showTags = false;
                this.showScript = false;
                this.isIndexing = false;
                this.eventSelected = false;

                /* Get the tagId of the current event. */
                var tagId = eventManager.current.tagId;

                /* Get the next set of tags based on the tag in the current event. */
                tags.current = $scope.tagset.getNextTags(tagId);

                /* Snap video back to time of current event. */
                videoplayer.seekTime(eventManager.current.time);
                videoplayer.play();
            },

            /**
            * Moves backwards through previously indexed events and plays.
            */
            back: function() {

                /* If editing an event. */
                if (this.eventSelected) {

                    this.eventSelected = false;
                    this.showTags = true;
                    this.showScript = false;
                    this.isIndexing = true;
                    videoplayer.play();
                }

                /* If the tags are showing. */
                else if (this.showTags) {

                    /* Drop back into not this state. */
                    this.showTags = false;
                    this.showScript = false;
                    this.isIndexing = false;
                    videoplayer.play();
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
                playManger.save();

                /* Clear the current play. */
                playManager.clear();
            }
        };

        return IndexingService;
    }
]);
