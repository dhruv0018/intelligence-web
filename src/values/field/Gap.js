import Field from './Field.js';
import GapConstants from '../../constants/football/gaps.js';

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        this.GAPS =  GapConstants.GAPS;
        this.GAP_IDS = GapConstants.GAP_IDS;

        let gap = {
            gapId: !field.isRequired ? null : undefined,
            name: !field.isRequired ? 'Optional' : undefined,
            keyboardShortcut: null
        };

        if (field.value) gap = this.GAPS[this.GAP_IDS[field.value]];

        this.currentValue = gap;
        this.availableValues = Object.keys(this.GAPS).map(key => this.GAPS[key]);
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(gap) {
        let value = {};
        value.name = gap.name;
        value.gapId = gap.value;
        value.keyboardShortcut = gap.shortcut;
        this.value = value;
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.gapId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default GapField;
