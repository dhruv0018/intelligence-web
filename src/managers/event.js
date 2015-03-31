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
    'PlaylistEventEmitter', 'TagsetsFactory',
    function service(playlistEventEmitter, tagsets) {

        let current;

        Object.defineProperty(this, 'current', {

            get: function() {

                return current;
            },

            set: function(value) {

                current = value;

                playlistEventEmitter.emit('EVENT_CURRENT_CHANGE', current);
            }
        });

        /* On event select; set the current event to match the selected event. */
        playlistEventEmitter.on('EVENT_SELECT', event => this.current = event);

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
            var tag = tagsets.getTag(tagId);
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
            var tag = tagsets.getTag(tagId);
            var tagVariables = tag.tagVariables;
            var tagVariable = tagVariables[index];

            this.current.variableValues[tagVariable.id].value = undefined;
        };
    }
]);
