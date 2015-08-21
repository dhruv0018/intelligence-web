import Field from './Field';
import GapConstants from '../../constants/football/gaps';
const GAPS = GapConstants.GAPS;
const GAP_IDS = GapConstants.GAP_IDS;

/**
 * GapField Field Model
 * @class GapField
 */
class GapField extends Field {

    /**
     * @constructs GapField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {
        super(field);

        let gapId = this.initializeValue(field.value);
        let gap = angular.copy(GAPS[GAP_IDS[gapId]]);
        let value = {
            gapId,
            get name () {
                let calculatedName = field.name;
                if (gapId) {
                    calculatedName = gap.name;
                }
                return calculatedName;
            },
            get keyboardShortcut() {
                return gap ? gap.shortcut : undefined;
            }
        };
        this.value = value;
    }
    get availableValues() {
        let values = [];
        values = Object.keys(GAPS).map(key => {
            let currentGap = angular.copy(GAPS[key]);
            let value = {
                gapId: Number(currentGap.value),
                name: currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
            return value;
        });
        if (!this.isRequired) {
            values.unshift({name: this.name, gapId: null, keyboardShortcut: undefined});
        }
        return values;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.gapId) :
            true;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value         = this.value.gapId === null ? null : String(this.value.gapId);

        variableValue = {

            type: null,
            value: value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default GapField;
