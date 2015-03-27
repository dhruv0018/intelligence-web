import KrossoverEvent from '../entities/event.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module Indexing
 * @name EventManager
 * @type {service}
 */
IntelligenceWebClient.service('EventManager', [
    '$injector', 'TagsetsFactory',
    function service($injector, tagsets) {

        var playManager;

        this.tagset = null;

        this.current = null;

        /**
         * Checks whether the event is a floating event.
         * @returns - true if the event is floating event; false otherwise.
         */
        this.isFloatingEvent = function(event) {

            event = event || this.current;

            /* If there is no current event or the event hasn't been created
             * then its can not be a floating event. */
            if (!event || !event.tagId) return false;

            /* Check if the given event is an end tag. */
            return this.tagset.isFloatTag(event.tagId);
        };

        /**
         * Checks whether the event is an ending event.
         * @returns - true if the event is an end event; false otherwise.
         */
        this.isEndEvent = function(event) {

            event = event || this.current;

            /* If there is no current event or the event hasn't been created
             * then its can not be a end event. */
            if (!event || !event.tagId) return false;

            /* Check if the given event is an end tag. */
            return this.tagset.isEndTag(event.tagId);
        };

        /**
         * Checks whether the event is an end-and-start event.
         * @returns - true if the event is an end-and-start event; false otherwise.
         */
        this.isEndAndStartEvent = function(event) {

            event = event || this.current;

            /* If there is no current event or the event hasn't been created
             * then its can not be a end event. */
            if (!event || !event.tagId) return false;

            var tagId = event.tagId;
            var tag = this.tagset.tags[tagId];

            /* Check if the given event is an end tag and only has one child. */
            return this.isEndEvent(event) && tag.children.length === 1;
        };

        /**
         * Checks whether the event has variables.
         * @returns - true if the event has variables; false otherwise.
         */
        this.hasVariables = function() {

            /* If there is no current event or the event hasn't been created
             * there are no variables in the event yet. */
            if (!this.current || !this.current.tagId) return false;

            var tagId = this.current.tagId;
            var tag = this.tagset.tags[tagId];

            /* Check if the tag has tag variables. */
            return !!Object.keys(tag.tagVariables).length;
        };

        /**
         * Gets the value of the active variable.
         * @returns - the value of the active variable.
         */
        this.activeEventVariableValue = function() {

            /* If there is no current event or the event hasn't been created
             * variable value is undefined. */
            if (!this.current || !this.current.tagId) return undefined;

            var index = this.current.activeEventVariableIndex;
            var tagId = this.current.tagId;
            var tag = this.tagset.tags[tagId];
            var tagVariables = tag.tagVariables;
            var tagVariable = tagVariables[index];

            if (!tagVariable) return undefined;

            return this.current.variableValues[tagVariable.id].value;
        };

        /**
         * Clears the active variables value.
         */
        this.clearActiveEventVariableValue = function() {

            var index = this.current.activeEventVariableIndex;
            var tagId = this.current.tagId;
            var tag = this.tagset.tags[tagId];
            var tagVariables = tag.tagVariables;
            var tagVariable = tagVariables[index];

            this.current.variableValues[tagVariable.id].value = undefined;
        };

        /**
         * Checks if all the variables have values.
         * @returns {Boolean} true, if all of the variables have a value;
         * false otherwise.
         */
        this.allEventVariablesHaveValues = function() {

            var self = this;

            var tagId = this.current.tagId;
            var tag = this.tagset.tags[tagId];
            var tagVariables = tag.tagVariables;
            var variableValues = self.current.variableValues;

            /* Ensure that every required variable has a value. */
            return Object.keys(tagVariables).every(function(index) {

                /* Lookup the tag variable by its script index. */
                var tagVariable = tagVariables[index];

                /* If the variable is not required, it doesn't need a value. */
                if (!tagVariable.isRequired) return true;

                /* Lookup the variable by tag variable ID. */
                var variable = variableValues[tagVariable.id];

                /* Check if the variable has a value. */
                return !!variable.value;
            });
        };

        /**
         * Resets the current play to the original model.
         */
        this.reset = function(tagset) {

            this.tagset = tagset || this.tagset;

            this.current = new KrossoverEvent();
        };

        /**
         * TODO: Remove after event entity
         * Creates a new event.
         * Creates an event with a tag specified by the tagId and time.
         * @param {Number} tagId - the ID of a tag.
         * @param {Number} time - the time the event took place.
         */
        this.create = function(tagId, time) {

            playManager = playManager || $injector.get('PlayManager');

            let tag = tagsets.getTag(tagId);

            this.current = new KrossoverEvent(tag, time);

            /* Add event to the current play. */
            playManager.addEvent(this.current);
        };
    }
]);
