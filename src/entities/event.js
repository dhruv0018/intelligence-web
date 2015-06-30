import Tag from './tag';

class Event extends Tag {

    constructor (event, tag, time, gameId) {

        /* If only two parameters are passed, we don't have an event, so
         * reassign values. */
        if (arguments.length === 2) {

            time  = tag;
            tag   = event;
            event = null;
        }

        /* Build out tag instance via super */
        super(tag);
        this.tagId = this.id;

        /* Add event data */
        event                         = event || {};
        this.variableValues           = event.variableValues || {};
        this.activeEventVariableIndex = event.activeEventVariableIndex || 1;
        this.id                       = event.id;
        this.playId                   = event.playId;
        this.time                     = time;

        this.fields = {};

        //todo refactor this later
        Object.keys(this.tagVariables).forEach( (positionId, index) => {
            index = index + 1;
            let variableValue = angular.copy(this.tagVariables[positionId]) || {};
            let tagVariable = this.tagVariables[index];
            variableValue.gameId = gameId;
            variableValue.inputType = tagVariable.type;
            variableValue.options = tagVariable.options;
            variableValue.formations = tagVariable.formations;
            variableValue.id = tagVariable.id;
            variableValue.order = index;
            variableValue.isRequired = tagVariable.isRequired;
            delete variableValue.type;
            let temporaryVariable = this.variableValues[variableValue.id] || {};
            variableValue.value = temporaryVariable.value;
            this.variableValues[tagVariable.id] = variableValue;
        });
        this.indexFields(this.variableValues, 'variableValues');

    }
    /**
     * Getter for event.shortcutKey
     * @method Event.shortcutKey
     * @readonly
     * @returns {String} shortcutKey
     */
    get keyboardShortcut () {

        return this.shortcutKey;
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

    toJSON () {

        let copy = super.toJSON(this);

        delete copy.activeEventVariableIndex;
        delete copy.indexerScript;
        delete copy.userScript;
        delete copy.shortcutKey;
        delete copy.description;
        delete copy.isStart;
        delete copy.isEnd;
        delete copy.tagSetId;
        delete copy.children;
        delete copy.tagVariables;
        delete copy.pointsAssigned;
        delete copy.assignThisTeam;
        delete copy.isPeriodTag;
        delete copy.summaryPriority;
        delete copy.summaryScript;
        delete copy.buffer;
        delete copy.name;

        Object.keys(copy.variableValues).forEach(key => {

            let variableValue = copy.variableValues[key];

            copy.variableValues[key] = {
                type: variableValue.type,
                value: variableValue.value
            };
        });

        return copy;
    }
}

export default Event;
