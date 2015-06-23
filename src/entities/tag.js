import Entity from './entity';

class KrossoverTag extends Entity {

    /**
     * Constructor:
     * Instantaties KrossoverTag
     *
     * @param: {Object} Tag JSON
     */
    constructor (tag) {

        if (!arguments.length) {

            throw new Error('Invoking KrossoverTag.constructor without passing a JSON object');
        }

        super(tag);

        if (Array.isArray(this.tagVariables)) {

            this.indexTagVariables();
        }

        this.mapScriptTypes();
    }

    /**
     * Getter for tag.shortcutKey
     * @method KrossoverTag.shortcutKey
     * @readonly
     * @returns {String} shortcutKey
     */
    get keyboardShortcut () {

        return this.shortcutKey;
    }

    /**
     * Getter for tag.fields
     * @method KrossoverTag.fields
     * @readonly
     * @returns {Array} fields
     */
    get fields () {

        return this.tagVariables;
    }

    /**
     * Method: indexTagVariables
     * Takes the tag variables array and converts it into an Object keyed by
     * index ID.
     *
     * @return: {undefined}
     */
    indexTagVariables () {

        let indexedVariables = {};

        this.tagVariables.forEach((variable, index) => {

            indexedVariables[++index] = variable;

            if (variable.formations) {

                let indexedFormations = {};

                variable.formations.forEach(formation => {

                    indexedFormations[formation.id] = formation;
                });

                variable.formations = indexedFormations;
            }
        });

        this.tagVariables = indexedVariables;
    }

    /**
     * Method: mapScriptTypes
     * Maps script type strings from string to array.
     *
     * @return: {undefined}
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

                        /* Find the tag variable by script index. */
                        let tagVariable = this.tagVariables[index];

                        /* Store the index position of the tag variable. */
                        tagVariable.index = index;

                        return tagVariable;
                    }

                    /* If the item is not a variable return it as is. */
                    else return item;
                });
            }
        });
    }

    /**
     * Method: toJSON
     * Transforms the data back into the format excpected by the server:
     * convert tag variables back to array; change scripts back to string.
     *
     * @return: {Object} The JSON
     */
    toJSON () {

        let copy = Object.assign({}, this);

        ['userScript', 'indexerScript', 'summaryScript'].forEach(scriptType => {

            let script = copy[scriptType];

            if (script) {

                copy[scriptType] = script
                .map(item => {

                    if (typeof item === 'string') {

                        return item;
                    } else {

                        return `__${item.index}__`;
                    }
                })
                .join('');
            }
        });

        if (copy.tagVariables) {

            let tagVariables = [];

            Object.keys(copy.tagVariables).forEach(tagVariableKey => {

                var tagVariable = copy.tagVariables[tagVariableKey];

                if (tagVariable.formations) {

                    let formations = [];

                    Object.keys(tagVariable.formations).forEach(tagVariableFormationsKey => {

                        let formation = tagVariable.formations[tagVariableFormationsKey];

                        formations.push(formation);
                    });

                    tagVariable.formations = formations;
                }

                tagVariables[--tagVariableKey] = tagVariable;
            });

            copy.tagVariables = tagVariables;
        }

        return copy;
    }
}

export default KrossoverTag;
