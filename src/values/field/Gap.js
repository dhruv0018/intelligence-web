import Field from './Field';
import GapConstants from '../../constants/football/gaps';

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

        if (!field) return;
        super(field);

        this.GAPS = GapConstants.GAPS;
        this.GAP_IDS = GapConstants.GAP_IDS;
        this.availableValues = Object.keys(this.GAPS).map(key => {
            let currentGap = angular.copy(this.GAPS[key]);
            let value = {
                gapId: Number(currentGap.value),
                name: currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
            return value;
        });
        let initialGap = {
            name: !field.isRequired ? 'Optional' : 'Select',
            gapId: !field.isRequired ? null : undefined,
            keyboardShortcut: undefined
        };
        this.availableValues.unshift(initialGap);

        this.initialize();
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {object} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let gap = angular.copy(this.availableValues[0]);

        if (value) {

            let currentGap = angular.copy(this.GAPS[this.GAP_IDS[value]]);

            gap = {

                gapId           : Number(currentGap.value),
                name            : currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
        }

        this.currentValue = gap;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value gap-field">${this.currentValue.name}</span>`;
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
