import Entity from './entity';
import TeamPlayerField from '../values/field/TeamPlayer';
import GapField from '../values/field/Gap';
import PassingZoneField from '../values/field/PassingZone';
import FormationField from '../values/field/Formation';
import DropdownField from '../values/field/Dropdown';
import TextField from '../values/field/Text';
import YardField from '../values/field/Yard';
import ArenaField from '../values/field/Arena';
import PlayerField from '../values/field/Player';
import TeamField from '../values/field/Team';

class KrossoverTag extends Entity {

    /**
     * Constructor:
     * Instantaties KrossoverTag
     *
     * @param: {Object} Tag JSON
     */
    constructor (tag) {

        super(tag);

        this.fields = {};

        if (Array.isArray(this.tagVariables)) {

            this.tagVariables.forEach(variable => {

                let field = this.createField(variable);
                this.fields[field.id] = field;
            });
            this.indexTagVariables();
        }

        this.mapScriptTypes();
    }

    /**
     * Getter for tag.shortcutKey
     * @method KrossoverTag.keyboardShortcut
     * @readonly
     * @returns {String} shortcutKey
     */
    get keyboardShortcut () {

        return this.shortcutKey;
    }

    /**
     * Setter for tag.shortcutKey
     * @method KrossoverTag.keyboardShortcut
     * @readonly
     * @param {Object}
     * @returns {undefined}
     */
    set keyboardShortcut (value) {

        return;
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
     * Method: createField
     * Instantiates and returns a Field based on input type.
     * @returns {Field} - Depending on input type.
     */
    createField (rawField) {

        let field;

        switch (rawField.inputType) {

        case 'PLAYER_DROPDOWN':
            field = new PlayerField(rawField);
            break;
        case 'TEAM_DROPDOWN':
            field = new TeamField(rawField);
            break;
        case 'PLAYER_TEAM_DROPDOWN':
            field = new TeamPlayerField(rawField);
            break;
        case 'GAP':
            field = new GapField(rawField);
            break;
        case 'PASSING_ZONE':
            field = new PassingZoneField(rawField);
            break;
        case 'FORMATION':
            field = new FormationField(rawField);
            break;
        case 'DROPDOWN':
            field = new DropdownField(rawField);
            break;
        case 'TEXT':
            field = new TextField(rawField);
            break;
        case 'YARD':
            field = new YardField(rawField);
            break;
        case 'ARENA':
            field = new ArenaField(rawField);
            break;
        default:
            field = rawField;
        }

        return field;
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

        delete copy.fields;

        return copy;
    }
}

export default KrossoverTag;
