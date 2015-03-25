import Entity from './entity.js';

class Event extends Entity {

    constructor (event, tag, time) {

        if (!time) {

            time = tag;
            tag = event;
            event = null;
        }

        event = event || {};
        tag = JSON.parse(JSON.stringify(tag));

        delete tag.id;

        /* FIXME: Remove when code is updated. */
        event.activeEventVariableIndex = event.activeEventVariableIndex || 1;

        Object.assign(this, event, tag, { time });

        /* FIXME: Remove when API is updated. */
        Object.keys(this.tagVariables).forEach(key => {

            let tagVariable = this.tagVariables[key];
            tagVariable.inputType = tagVariable.type;
            delete tagVariable.type;

            Object.assign(this.variableValues[tagVariable.id], tagVariable);
        });
    }

    /**
     * Checks whether the event has variables.
     * @returns - true if the event has variables; false otherwise.
     */
    get hasVariables () {

        /* Check if the event has tag variables. */
        return !!Object.keys(this.tagVariables).length;
    }

    /**
     * Checks if all the variables have values.
     * @returns {Boolean} true, if all of the variables have a value;
     * false otherwise.
     */
    get isValid () {

        function variableFromKey (tagVariableId) {

            /* Lookup the tag variable. */
            return this.variableValues[tagVariableId];
        }

        function variableIsValid (variable) {

            /* If the variable is not required, it doesn't need a value. */
            if (!variable.isRequired) return true;

            /* Check if the variable has a value. */
            return !!variable.value;
        }

        /* Ensure that every required variable has a value. */
        return Object.keys(this.variableValues)
        .map(variableFromKey)
        .every(variableIsValid);
    }

    /**
     * Checks whether the event is a floating event.
     * @returns - true if the event is floating event; false otherwise.
     */
    get isFloat () {

        return this.isStart === false &&
               this.isEnd === false &&
               this.children.length === 0;
    }

    /**
     * Checks whether the event is an end-and-start event.
     * @returns - true if the event is an end-and-start event; false otherwise.
     */
    get isEndAndStart () {

        /* Check if the given event is an end tag and only has one child. */
        return this.isEnd && this.children.length === 1;
    }
}

export default Event;

