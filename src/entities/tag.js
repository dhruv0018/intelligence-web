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
     * Unmaps scripts back to string from array.
     *
     * @method unMapScriptTypes
     * @returns {string|undefined} - script as string or undefined if no script
     */
    unMapScriptTypes (scriptType) {

        if (this[scriptType]) {

            return this[scriptType].map(item => {

                if (item.type === 'STATIC') {

                    return item.toJSON();
                } else {

                    return item;
                }
            })
            .join('');
        }
    }

    /**
     * Transforms the data back into the format excpected by the server:
     * convert tag variables back to array; change scripts back to string.
     *
     * @method toJSON
     * @returns {undefined}
     */
    toJSON () {

        return {

            id             : this.id,
            name           : this.name,
            shortcutKey    : this.shortcutKey,
            description    : this.description,
            isStart        : this.isStart,
            isEnd          : this.isEnd,
            tagSetId       : this.tagSetId,
            children       : this.children,
            pointsAssigned : this.pointsAssigned,
            assignThisTeam : this.assignThisTeam,
            isPeriodTag    : this.isPeriodTag,
            summaryPriority: this.summaryPriority,
            buffer         : this.buffer,
            tagVariables   : this.tagVariables,
            userScript     : this.unMapScriptTypes('userScript'),
            indexerScript  : this.unMapScriptTypes('indexerScript'),
            summaryScript  : this.unMapScriptTypes('summaryScript')
        };
    }
}

export default KrossoverTag;
