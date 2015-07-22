import Entity from './entity';
import FieldFactory from '../values/field/FieldFactory';

const schema = require('../../schemas/event.json');

/**
 * KrossoverEvent Entity Model
 * @class KrossoverEvent
 */
class KrossoverEvent extends Entity {

    /**
     * @constructs KrossoverEvent
     * @param {Object} event     - Event JSON
     * @param {KrossoverTag} tag - An instantiated KrossoverTag tag
     * @param {Number} time      - The time
     * @param {Number} gameId    - The game ID
     */
    constructor (event, tag, time, gameId) {

        /* Validate event JSON */
        let validation = this.validate(event, schema);

        if (validation.errors.length) {

            console.warn(validation.errors.shift());
        }

        super(tag);

        /* TODO: Get rid of this property when indexing service is refactored */
        this.activeEventVariableIndex = event.activeEventVariableIndex || 1;

        this.tagId  = tag.id;
        this.id     = event.id;
        this.playId = event.playId;
        this.time   = time;

        if (event.variableValues) {

            /* Transform variables */
            Object.keys(this.fields).forEach((order, index) => {

                let variableValue = event.variableValues[this.fields[order].id];

                this.fields[order].gameId = gameId;
                this.fields[order].value  = variableValue.value;
            });
        }
    }

    /**
     * Getter for this.shortcutKey
     *
     * @readonly
     * @type {String}
     */
    get keyboardShortcut () {

        return this.shortcutKey;
    }

    set keyboardShortcut (value) {

        return;
    }

    /**
     * Checks if all the variables have values.
     *
     * @method isValid
     * @returns {Boolean} - true, if all fields are valid; false otherwise.
     */
    isValid () {

        Object.keys(this.fields).forEach(order => {

            if (!this.fields[order].isValid()) {

                return false;
            }
        });

        return true;
    }

    /**
     * Checks whether the event is a floating event.
     *
     * @method isFloat
     * @returns {Boolean} - true if the event is floating event; false otherwise.
     */
    isFloat () {

        return this.isStart === false && this.isEnd === false && this.children && this.children.length === 0;
    }

    /**
     * Checks whether the event is an end-and-start event: is an end tag and
     * only has one child.
     *
     * @method isEndAndStart
     * @returns {Boolean} - true if the event is an end-and-start event; false otherwise.
     */
    isEndAndStart () {

        return this.isEnd && this.children && this.children.length === 1;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let copy = Object.assign({}, this);

        delete copy.activeEventVariableIndex;
        delete copy.indexerScript;
        delete copy.userScript;
        delete copy.shortcutKey;
        delete copy.description;
        delete copy.isStart;
        delete copy.isEnd;
        delete copy.tagSetId;
        delete copy.children;
        delete copy.pointsAssigned;
        delete copy.assignThisTeam;
        delete copy.isPeriodTag;
        delete copy.summaryPriority;
        delete copy.summaryScript;
        delete copy.buffer;
        delete copy.name;

        copy.variableValues = {};

        Object.keys(copy.fields).forEach(order => {

            console.log('copy.fields[order]', copy.fields[order]);
            copy.variableValues[copy.fields[order].id] = copy.fields[order].toJSON();
        });

        return copy;
    }
}

export default KrossoverEvent;
