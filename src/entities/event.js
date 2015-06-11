import Entity from './entity.js';
import Field from './field.js';

class Event extends Entity {

    constructor (event, tag, time) {

        if (arguments.length === 2) {

            time = tag;
            tag = event;
            event = null;
        }

        event = event || {};
        event.variableValues = event.variableValues || {};
        event.activeEventVariableIndex = event.activeEventVariableIndex || 1;

        tag = Object.assign({}, tag);

        tag.tagId = tag.id;
        delete tag.id;

        Object.assign(this, event, tag, { time });
        /* FIXME: Remove when API is updated. */
        if (this.tagVariables) Object.keys(this.tagVariables).forEach(key => {

            let tagVariable = Object.assign({}, this.tagVariables[key]);
            tagVariable.inputType = this.tagVariables[key].type;
            delete tagVariable.type;
            this.variableValues[tagVariable.id] = this.variableValues[tagVariable.id] || {};
            Object.assign(this.variableValues[tagVariable.id], tagVariable);
            this.variableValues[tagVariable.id].type = this.variableValues[tagVariable.id].type || null;
            if (!this.variableValues[tagVariable.id].isRequired && this.variableValues[tagVariable.id].value === undefined) {
                this.variableValues[tagVariable.id].value = null;
            }
            console.log(new Field(this.variableValues[tagVariable.id]));
        });
    }

    /**
     * Checks whether the event has variables.
     * @returns - true if the event has variables; false otherwise.
     */
    get hasVariables () {

        /* Check if the event has tag variables. */
        return this.tagVariables && !!Object.keys(this.tagVariables).length;
    }

    /**
     * Checks if all the variables have values.
     * @returns {Boolean} true, if all of the variables have a value;
     * false otherwise.
     */
    get isValid () {

        const self = this;

        function variableFromKey (tagVariableId) {

            /* Lookup the tag variable. */
            return self.variableValues[tagVariableId];
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

        return this.isStart === false && this.isEnd === false && this.children && this.children.length === 0;
    }

    /**
     * Checks whether the event is an end-and-start event.
     * @returns - true if the event is an end-and-start event; false otherwise.
     */
    get isEndAndStart () {

        /* Check if the given event is an end tag and only has one child. */
        return this.isEnd && this.children && this.children.length === 1;
    }
}

export default Event;
