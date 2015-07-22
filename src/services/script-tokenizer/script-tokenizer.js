import FieldFactory from '../../values/field/FieldFactory';

/**
 * ScriptTokenizer Factory
 * @class ScriptTokenizer
 * @static
 */
class ScriptTokenizer {

    /**
     * @constructs FieldFactory
     */
    constructor () {

        throw new Error('Cannot instantiate; ScriptTokenizer is a static class!');
    }

    /**
     * Maps script strings from string to array of fields.
     *
     * @method mapScriptTypes
     * @static
     * @returns {undefined}
     */
    static tokenizeScript (script, fields) {

        let VARIABLE_PATTERN       = /(__\d__)/;
        let VARIABLE_INDEX_PATTERN = /\d/;

        /* Split up script into array items and replace variables
         * with the actual tag variable object. */
        return script.split(VARIABLE_PATTERN)

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

                console.log('   `---> index:', index);
                console.log('   `---> fields[index]:', fields[index]);
                return fields[index];
            }

            /* If the item is not a variable, return it as STATIC. */
            else {

                let rawField = {

                    value: item,
                    type: 'STATIC'
                };

                return FieldFactory.createField(rawField);
            }
        });
    }

    /**
     * Maps script strings from string to array of fields.
     *
     * @method toString
     * @static
     * @returns {undefined}
     */
    static toString (fields) {

        let string = ``;

        script.forEach(item => {

            if (item.type === 'STATIC') {

                string += item.toString();
            } else {

                let field = fields[item.index];
                if (field) {

                    string += field.toString();
                }
            }
        });

        return string;
    }
}

export default ScriptTokenizer;
