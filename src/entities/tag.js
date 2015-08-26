import Entity from './entity';
import FieldFactory from '../values/field/FieldFactory';

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

        this.userScript    = this.mapScriptTypes(this.userScript);
        this.indexerScript = this.mapScriptTypes(this.indexerScript);
        this.summaryScript = this.mapScriptTypes(this.summaryScript);
    }

    /**
     * Getter for keyboard shortcut, or key sequence, used to apply tag.
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

        let VARIABLE_PATTERN = /(__\d__)/;

        if (script) {

            /* Split up script into array items and replace variables
             * with the actual tag variable object. */
            script = script.split(VARIABLE_PATTERN)

            /* Filter script items. */
            .filter(item => item.length)

            /* Map script items. */
            .map(item => {

                if (VARIABLE_PATTERN.test(item)) {

                    return item;
                } else {

                    return FieldFactory.createField({value: item, type: 'STATIC'});
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

        throw new Error('Cannot call toJSON on a Tag Entity; nothing to send to server!');
    }
}

export default KrossoverTag;
