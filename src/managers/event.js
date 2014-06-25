var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * @module Indexing
 * @name EventManager
 * @type {service}
 */
IntelligenceWebClient.service('EventManager', [
    'TagsManager', 'PlayManager',
    function service(tags, play) {

        var model = {

            variableValues: {},
            activeEventVariableIndex: 1
        };

        this.tags = null;

        this.tagset = null;

        this.current = angular.copy(model);

        /**
         * Checks whether the event is an ending event.
         * @returns - true if the event is an end event; false otherwise.
         */
        this.isEndEvent = function(event) {

            event = event || this.current;

            return event && event.tag && this.tagset.isEndTag(event.tag.id);
        };

        /**
         * Checks whether the event has variables.
         * @returns - true if the event has variables; false otherwise.
         */
        this.hasVariables = function() {

            return this.current &&
                   this.current.tag &&
                   this.current.tag.tagVariables &&
                 !!this.current.tag.tagVariables.length;
        };

        /**
         * Gets the value of the event variable at the given index.
         * @param {Number} index - index of the variable.
         * @returns - the variable's value if available, or undefined if not.
         */
        this.eventVariableValue = function(index) {

            if (this.current &&
                this.current.variableValues &&
              !!this.current.variableValues[index]) {

                return this.current.variableValues[index].value;
            }

            else return undefined;
        };

        /**
         * Gets the value of the active variable.
         * @returns - the value of the active variable.
         */
        this.activeEventVariableValue = function() {

            return this.eventVariableValue(this.current.activeEventVariableIndex);
        };

        /**
         * Clears the active variables value.
         */
        this.clearActiveEventVariableValue = function() {

            this.current.variableValues[this.current.activeEventVariableIndex].value = null;
        };

        /**
         * Checks if all the variables have values.
         * @returns {Boolean} true, if all of the variables have a value;
         * false otherwise.
         */
        this.allEventVariablesHaveValues = function() {

            var self = this;

            if (self.current && self.current.variableValues) {

                return Object.keys(self.current.variableValues).every(function(eventVariableIndex) {

                    return self.eventVariableValue(eventVariableIndex) === 0 ? true : !!self.eventVariableValue(eventVariableIndex);
                });
            }

            return false;
        };

        /**
         * Resets the current play to the original model.
         */
        this.reset = function(tagset) {

            this.tagset = tagset || this.tagset;

            this.tags = this.tagset.getIndexedTags();

            this.current = angular.copy(model);
        };

        /**
         * Creates a new event.
         * Creates an event with a tag specified by the tagId and time.
         * @param {Number} tagId - the ID of a tag.
         * @param {Number} time - the time the event took place.
         */
        this.create = function(tagId, time) {

            if (!play.current) {

                play.create();
            }

            /* Lookup and set the tag from the indexing tags. */
            this.current.tag = this.tags[tagId];

            this.current.time = time;

            /* Add event to the current play. */
            play.current.events.push(this.current);
        };

        /**
         * Deletes the current event.
         */
        this.delete = function(event) {

            /* Find the index of the event. */
            var eventIndex = play.current.events.indexOf(this.current);

            /* Remove current event from the current play. */
            play.current.events.splice(eventIndex, 1);

            /* If there are other events left in the play. */
            if (play.current.events.length > 0) {

                /* Set the current event to the previous event. */
                var previousEventIndex = eventIndex - 1;
                var previousEvent = play.current.events[previousEventIndex];
                angular.copy(previousEvent, event.current);
                play.save();

            /* If there are no events left in the play. */
            } else {

                this.reset();
                play.remove(play.current);
            }
        };
    }
]);

