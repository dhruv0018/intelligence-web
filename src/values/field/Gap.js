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

    toJSON(){
        let variableValue = {};
        let value = this.value.gapId === null ? null : String(this.value.gapId);
        variableValue = {
            type: null,
            value: value
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default GapField;
