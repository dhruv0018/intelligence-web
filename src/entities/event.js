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

        if (!arguments.length) {

            throw new Error('KrossoverEvent cannot be instantiated with no parameters!');
        }

        /* Use tag to setup event */
        super(tag);

        Object.defineProperty(this, 'shortcutKey', {

            writable: false,
        });

        this.tagId = tag.id;
        this.time  = time;

        delete this.id;

        /* If we have an event, fill in the details */
        if (event) {

            /* Validate event JSON */
            /* TODO: Re-enable this at some point. Right now, far too many
             * events are failing validtion and polluting the console. */
            // let validation = this.validate(event, schema);
            //
            // if (validation.errors.length) {
            //
            //     console.warn(validation.errors.shift());
            // }

            this.id     = event.id;
            this.playId = event.playId;

            /* TODO: Get rid of this property when indexing service is refactored */
            this.activeEventVariableIndex = event.activeEventVariableIndex || 1;
        }

        this.fields = {};

        /* Transform variables into fields */
        this.tagVariables.forEach((tagVariable, index) => {
            let rawField = Object.assign({}, tagVariable);
            rawField.gameId = gameId;
            rawField.index  = index + 1;
            let variableValue = event && event.variableValues ? event.variableValues[tagVariable.id] : {};
            rawField.value    = variableValue.value;
            this.fields[index + 1] = FieldFactory.createField(rawField, variableValue.type);
        });
    }

    /**
     * Getter for Indexer Fields
     *
     * @type {Array}
     */
    get indexerFields () {

        return this.mapScript(this.indexerScript);
    }

    /**
     * Getter for Summary Fields
     *
     * @type {Array}
     */
    get summaryFields () {

        if (this.summaryScript) {

            return this.mapScript(this.summaryScript);
        } else {

            return null;
        }
    }

    /**
     * Getter for User Fields
     *
     * @type {Array}
     */
    get userFields () {

        return this.mapScript(this.userScript);
    }

    /**
     * Checks if all the variables have values.
     *
     * @method mapScript
     * @param {Array} script - A script array created by a KrossoverTag
     * @returns {Array}      - Script array with instantiated fields
     */
    mapScript (script) {

        if (!script) {

            return null;
        }

        let scriptFields = [];

        script.forEach(item => {

            let VARIABLE_INDEX_PATTERN = /\d/;

            /* If the item is a variable. */
            if (item.type !== 'STATIC') {

                /* Find the index of the variable in the script. */
                let index = Number(VARIABLE_INDEX_PATTERN.exec(item).pop());

                scriptFields.push(this.fields[index]);
            } else {

                scriptFields.push(item);
            }
        });

        scriptFields.toString = () => {

            let string = ``;

            scriptFields.forEach(item => {

                if (item.type === 'STATIC') {

                    string += item.toString();
                } else {

                    let field = this.fields[item.index];
                    if (field) {

                        string += field.toString();
                    }
                }
            });

            return string;
        };

        return scriptFields;
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

    /**
     * Getter for this.fields
     *
     * @readonly
     * @type {Object}
     */

    /* FIXME: variableValues is deprecated but many areas of the code still
     * reference it. Ultimately, all code should access fields directly. */
    get variableValues () {

        let variableValues = {};

        Object.keys(this.fields).forEach(order => {

            variableValues[this.fields[order].id] = this.fields[order];
        });

        return variableValues;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return Object.keys(this.fields)
        .map(fieldIndex => this.fields[fieldIndex])
        .every(field => field.valid);
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

            copy.variableValues[copy.fields[order].id] = copy.fields[order].toJSON();
        });

        return copy;
    }
}

export default KrossoverEvent;
