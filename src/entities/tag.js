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

        this.userScript    = this.mapScriptTypes(this.userScript);
        this.indexerScript = this.mapScriptTypes(this.indexerScript);
        this.summaryScript = this.mapScriptTypes(this.summaryScript);
    }

    /**
     * Getter for tag.shortcutKey
     *
     * @readonly
     * @type {String}
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
    mapScriptTypes (script) {

        let VARIABLE_PATTERN       = /(__\d__)/;
        let VARIABLE_INDEX_PATTERN = /\d/;

        if (script) {

            /* Split up script into array items and replace variables
             * with the actual tag variable object. */
            script = script.split(VARIABLE_PATTERN)

            /* Filter script items. */
            .filter(item => {

                /* Filter out empty items. */
                return item.length;
            })

            /* Map script items. */
            .map(item => {

                if (!VARIABLE_PATTERN.test(item)) {

                    let rawField = {

                        value: item,
                        type: 'STATIC'
                    };

                    // TODO: Add this to FieldFactory
                    return new StaticField(rawField);
                } else {

                    return item;
                }
            });
        }

        return script;
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
