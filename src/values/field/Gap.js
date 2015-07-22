import Field from './Field.js';
import GapConstants from '../../constants/football/gaps.js';

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        this.GAPS =  GapConstants.GAPS;
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

        let gap = angular.copy(this.availableValues[0]);

        if (field.value) {
            let currentGap = angular.copy(this.GAPS[this.GAP_IDS[field.value]]);
            gap = {
                gapId: Number(currentGap.value),
                name: currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
        }

        this.currentValue = gap;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(gap) {
        this.value = gap;
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
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON (){
        let variableValue = {};
        let value = this.value.gapId === null ? null : String(this.value.gapId);
        variableValue = {
            type: null,
            value: value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default GapField;
