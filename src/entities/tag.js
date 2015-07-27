import Entity from './entity';
import FieldFactory from '../values/field/FieldFactory';
import StaticField from '../values/field/Static';

/**
 * KrossoverTag Entity Model
 * @class KrossoverTag
 */
class KrossoverTag extends Entity {

    /**
     * @constructs KrossoverTag
     * @param {Object} tag - Tag JSON
     */
    constructor (tag) {

        super(tag);

        Object.defineProperty(this, 'shortcutKey', {

            writable: false,
        });

        /* Transform tagVariables into Fields */
        this.fields = {};
        this.tagVariables = this.tagVariables || [];

        this.tagVariables.forEach((tagVariable, index) => {

            this.fields[index + 1] = FieldFactory.createField(tagVariable);

            //todo temporary
            this.fields[index + 1].inputType = tagVariable.type;
        });

        /* TODO: eventually delete this.tagVariables when Event Manager no
         * longer needs it. */

        this.mapScriptTypes();
    }

    /**
     * Getter for tag.shortcutKey
     *
     * @method keyboardShortcut
     * @readonly
     * @returns {String} - this.shortcutKey
     */
    get keyboardShortcut () {

        return this.shortcutKey;
    }

    /**
     * Maps script type strings from string to array.
     *
     * @method mapScriptTypes
     * @returns {undefined}
     */
    mapScriptTypes () {

        let VARIABLE_PATTERN       = /(__\d__)/;
        let VARIABLE_INDEX_PATTERN = /\d/;

        ['userScript', 'indexerScript', 'summaryScript'].forEach(scriptType => {

            let script = this[scriptType];

            if (script) {

                /* Split up script into array items and replace variables
                 * with the actual tag variable object. */
                this[scriptType] = script.split(VARIABLE_PATTERN)

                /* Filter script items. */
                .filter(item => {

                    /* Filter out empty items. */
                    return item.length;
                })

                /* Map script items. */
                .map(item => {

                    /* If the item is a variable. */
                    if (VARIABLE_PATTERN.test(item)) {

                        /* Find the index of the variable in the script. */
                        let index = Number(VARIABLE_INDEX_PATTERN.exec(item).pop());

                        return this.fields[index];
                    }

                    /* If the item is not a variable, return it as STATIC. */
                    else {

                        let rawField = {

                            value: item,
                            type: 'STATIC'
                        };

                        return new StaticField(rawField);
                    }
                });

                this[scriptType].toString = () => {

                    let script = this[scriptType];
                    let string = ``;

                    script.forEach(item => {

                        if (item.type === 'STATIC') {

                            string += item.toString();
                        } else {

                            let field = this.fields[item.order];
                            if (field) {

                                string += field.toString();
                            }
                        }
                    });

                    return string;
                };
            }
        });
    }

    /**
     * Transforms the data back into the format excpected by the server:
     * convert tag variables back to array; change scripts back to string.
     *
     * @method toJSON
     * @returns {undefined}
     */
    toJSON () {

        // TODO: Implement this one day when the server is updated

        return;
    }
}

export default KrossoverTag;
