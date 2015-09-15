import Entity from '../entity';
import FieldFactory from '../../values/field/FieldFactory';
import template from './template';

const schema = require('../../../schemas/event.json');

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

        this.schema = schema;

        /* Use tag to setup event */
        super(tag);

        this.tagId = tag.id;
        this.time  = time;

        delete this.id;

        /* If we have an event, fill in the details */
        if (event) {

            /* Validate event JSON */
            /* TODO: Re-enable this at some point. Right now, far too many
             * events are failing validtion and polluting the console. */
            // let validation = this.validate(event);
            //
            // if (validation.errors.length) {
            //
            //     console.warn(validation.errors.shift());
            // }

            this.id     = event.id;
            this.playId = event.playId;
        }

        this.fields = {};

        /* Transform variables into fields */
        this.tagVariables.forEach((tagVariable, index) => {

            let variableValue;

            // few tag variable are not mandatory they have tagVariable.isRequired as false
            if (event && event.variableValues && !!event.variableValues[tagVariable.id]) {

                variableValue = event.variableValues[tagVariable.id];

            } else {

                variableValue = {value: undefined};
            }

            let rawField           = Object.assign({}, tagVariable);

            if (event) {

                rawField.eventId = event.id;
                rawField.playId = event.playId;
            }

            rawField.gameId        = gameId;
            rawField.index         = index + 1;
            rawField.value         = variableValue.value;
            this.fields[index + 1] = FieldFactory.createField(rawField, variableValue.type);
        });

        delete this.tagVariables;
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
     * Getter for Indexer Fields HTML
     *
     * @type {String}
     */
    get indexerHTML () {

        if (this.indexerFields) {

            return template(this, this.indexerFields.toString());
        }
    }

    /**
     * Getter for Summary Fields
     *
     * @type {Array|null}
     */
    get summaryFields () {

        return this.mapScript(this.summaryScript);
    }

    /**
     * Getter for Summary Fields HTML
     *
     * @type {String}
     */
    get summaryHTML () {

        if (this.summaryFields) {

            return this.summaryFields.toString();
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
     * Getter for User Fields HTML
     *
     * @type {String}
     */
    get userHTML () {

        if (this.userFields) {

            return template(this, this.userFields.toString());
        }
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

            return scriptFields.map(field => {

                return field.toString();
            })
            .join('');
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
     * Getter for the validity of the Field
     *
     * @type {Boolean}
     */
    get isValid () {

        return Object.keys(this.fields)
        .map(key => this.fields[key])
        .every(field => field.valid);
    }

    /**
     * Getter for whether the event is a floating event.
     *
     * @type {Boolean}
     */
    get isFloat () {

        return this.isStart === false && this.isEnd === false && this.children && this.children.length === 0;
    }

    /**
     * Getter whether the event is an end-and-start event: is an end tag and
     * only has one child.
     *
     * @type {Boolean}
     */
    get isEndAndStart () {

        return this.isEnd && this.children && this.children.length === 1;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        if (!this.isValid) {
            //FIXME we really should be throwing an error here
            console.error('Cannot convert event to JSON without valid field data!');
        }

        let copy = {

            id            : this.id,
            time          : this.time,
            tagId         : this.tagId,
            playId        : this.playId,
            variableValues: {},
        };

        Object.keys(this.fields).forEach(key => {

            copy.variableValues[this.fields[key].id] = this.fields[key].toJSON();
        });

        return copy;
    }
}

export default KrossoverEvent;
